import { NextApiRequest } from "next";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest
) => Promise<T>;
