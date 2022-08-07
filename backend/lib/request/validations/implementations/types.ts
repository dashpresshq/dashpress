import { NextApiRequest } from "next";
import { IAccountUser } from "shared/types";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest & { user?: IAccountUser },
  config?: unknown
) => Promise<T>;
