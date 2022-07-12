import { NextApiRequest, NextApiResponse } from "next";
import { handleResponseError } from "../errors";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

const RequestMethodResponseCode: Record<RequestMethod, number> = {
  DELETE: 204,
  GET: 200,
  PATCH: 200,
  POST: 201,
  PUT: 204,
};

export const requestHandler =
  (
    methodHandler: Partial<
      Record<RequestMethod, (req: NextApiRequest) => Promise<unknown>>
    >
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (Object.keys(methodHandler).includes(req.method)) {
        return res
          .status(RequestMethodResponseCode[req.method])
          .json(await methodHandler[req.method](req));
      }
    } catch (error) {
      console.log(error);
      return handleResponseError(res, error);
    }
    res.setHeader("Allow", Object.keys(methodHandler));
    return res.status(405).end(`Method '${req.method}' Not Allowed`);
  };
