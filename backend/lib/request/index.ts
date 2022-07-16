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
        (getRequest: <T>(key: ValidationKeys["_type"]) => T) => Promise<unknown>
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
    const validatedRequest = Object.fromEntries(
      await Promise.all(
        [...DEFAULT_VALIDATIONS, ...validationsToRun].map(
          async (validation) => {
            return [validation, await ValidationImpl[validation._type](req)];
          }
        )
      )
    );
    try {
      if (Object.keys(methodHandler).includes(req.method)) {
        return res.status(RequestMethodResponseCode[req.method]).json(
          await methodHandler[req.method](
            (requestKey: ValidationKeys["_type"]) => {
              return validatedRequest[requestKey];
            }
          )
        );
      }
    } catch (error) {
      return handleResponseError(res, error);
    }
    res.setHeader("Allow", Object.keys(methodHandler));
    return res.status(405).end(`Method '${req.method}' Not Allowed`);
  };
