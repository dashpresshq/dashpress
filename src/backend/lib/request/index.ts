import { NextApiRequest, NextApiResponse } from "next";
import * as μs from "microseconds";
import { handleResponseError } from "../errors";
import { RequestMethod, RequestMethodResponseCode } from "./methods";
import { ValidationKeys } from "./validations/types";
import { ValidationImpl } from "./validations/implementations";
import { logger } from "./logging";
import { requestHook } from "./portal";

/*
 The function below chooses 
 1. security => All request will be validated infact is impossible to not validate a request since you dont access to the Request object
 2. correctness => Heavy TS is making sure you can only call things that have been declared and TS will catch every TYPO or incorrect calls 
 3. conciseness => Need not to talk about this, The API takes for itself
 over 
 1. Non-repetition => One of the thing that is taking a bend is that some validation will be repeated twice or more over the same request
 1. Speed => Kind of like a child of the above issue, Await/Async will hopefully alleviate this a bit
*/

type GetValidatedRequestOptions<T> = Array<T | { _type: T; options: unknown }>;

export const requestHandler =
  (
    methodHandler: Partial<
      Record<
        RequestMethod,
        (
          getRequest: <T extends ValidationKeys["_type"]>(
            key: GetValidatedRequestOptions<T>
          ) => Promise<Record<T, any>>,
          res: NextApiResponse
        ) => unknown
      >
    >,
    validations?: ValidationKeys[]
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const before = μs.now();

    return await requestHook(req, async () => {
      const validationsToRun = (validations || []).filter((validation) => {
        if (!validation.method) {
          return true;
        }
        if (validation.method.includes(req.method as RequestMethod)) {
          return true;
        }
        return false;
      });

      const AUTH_VALIDATIONS: ValidationKeys[] = validationsToRun.some(
        (validation) => validation._type === "anyBody"
      )
        ? []
        : [
            {
              _type: "isAuthenticated",
              body: !validationsToRun.some(
                (validation) => validation._type === "guest"
              ),
            },
          ];

      try {
        for (const validation of [...AUTH_VALIDATIONS, ...validationsToRun]) {
          await ValidationImpl[validation._type](req, validation.body);
        }

        if (!Object.keys(methodHandler).includes(req.method)) {
          res.setHeader("Allow", Object.keys(methodHandler));
          return res.status(405).end(`Method '${req.method}' Not Allowed`);
        }

        const response = await methodHandler[req.method](
          async (
            requestKeys: GetValidatedRequestOptions<ValidationKeys["_type"]>
          ) => {
            return Object.fromEntries(
              await Promise.all(
                requestKeys.map(async (requestKeyInput) => {
                  const [requestKey, requestOptions] =
                    typeof requestKeyInput === "string"
                      ? [requestKeyInput, null]
                      : [requestKeyInput._type, requestKeyInput.options];
                  return [
                    requestKey,
                    await ValidationImpl[requestKey](req, requestOptions),
                  ];
                })
              )
            );
          },
          res
        );

        if (res.hasHeader("Content-Type")) {
          return;
        }
        const since = Math.round(μs.since(before) / 1000);

        logger.http(`${req.method} ${req.url} ${since}ms`);

        return res.status(RequestMethodResponseCode[req.method]).json(response);
      } catch (error) {
        const errorResponse = handleResponseError(req, error);
        logger.error(
          `${req.method} ${req.url} ${JSON.stringify(errorResponse)}`
        );

        return res.status(errorResponse.statusCode).json(errorResponse);
      }
    });
  };
