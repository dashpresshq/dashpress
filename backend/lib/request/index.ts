import { NextApiRequest, NextApiResponse } from "next";
import { handleResponseError } from "../errors";
import { RequestMethod, RequestMethodResponseCode } from "./methods";
import { ValidationKeys } from "./validations";
import { ValidationImpl } from "./validations/implementations";

const DEFAULT_VALIDATIONS: ValidationKeys[] = [{ _type: "isAuthenticated" }];

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
            await Promise.all(
              requestKeys.map(async (requestKey) => [
                requestKey,
                await ValidationImpl[requestKey](req),
              ])
            );
          }
        )
      );
    } catch (error) {
      return handleResponseError(res, error);
    }
  };

// security, correctness vs speed and repetition
