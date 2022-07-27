import { NextApiRequest, NextApiResponse } from "next";
import { handleResponseError } from "../errors";
import { RequestMethod, RequestMethodResponseCode } from "./methods";
import { ValidationKeys } from "./validations";
import { ValidationImpl } from "./validations/implementations";

const DEFAULT_VALIDATIONS: ValidationKeys[] = [{ _type: "isAuthenticated" }];

/*
 The function below chooses 
 1. security => All request will be validated infact is impossible to not validate a request since you dont access to the Request object
 2. correctness => Heavy TS is making sure you can only call things that have been declared and TS will catch every TYPO or incorrect calls 
 3. conciseness => Need not to talk about this, The API takes for itself
 over 
 1. Non-repetition => One of the thing that is taking a bend is that some validation will be repeated twice or more over the same request
 1. Speed => Kind of like a child of the above issue, Await/Async will hopefully alleviate this a bit
*/

export const requestHandler =
  (
    methodHandler: Partial<
      Record<
        RequestMethod,
        (
          getRequest: <T extends ValidationKeys["_type"]>(
            key: T[]
          ) => Promise<Record<T, any>>
        ) => unknown
      >
    >,
    validations?: ValidationKeys[]
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const validationsToRun = (validations || []).filter((validation) => {
      if (!validation.method) {
        return true;
      }
      if (validation.method.includes(req.method as RequestMethod)) {
        return true;
      }
      return false;
    });
    // if request contains `guest` the remove the validation `isAuthenticated`
    await Promise.all(
      [...DEFAULT_VALIDATIONS, ...validationsToRun].map(async (validation) => {
        return await ValidationImpl[validation._type](req);
      })
    );
    try {
      if (!Object.keys(methodHandler).includes(req.method)) {
        res.setHeader("Allow", Object.keys(methodHandler));
        return res.status(405).end(`Method '${req.method}' Not Allowed`);
      }
      return res.status(RequestMethodResponseCode[req.method]).json(
        await methodHandler[req.method](
          async (requestKeys: ValidationKeys["_type"][]) => {
            return Object.fromEntries(
              await Promise.all(
                requestKeys.map(async (requestKey) => [
                  requestKey,
                  await ValidationImpl[requestKey](req),
                ])
              )
            );
          }
        )
      );
    } catch (error) {
      return handleResponseError(res, error);
    }
  };
