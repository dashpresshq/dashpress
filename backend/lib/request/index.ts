import { NextApiRequest, NextApiResponse } from "next";
import { handleResponseError } from "../errors";
import { RequestMethod, RequestMethodResponseCode } from "./methods";
import { ValidationImpl, ValidationKeys } from "./validation";

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
    // TODO default is authenticated
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
        validationsToRun.map(async (validation) => {
          return [validation, await ValidationImpl[validation._type](req)];
        })
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
