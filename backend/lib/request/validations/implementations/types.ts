import { IAccountUser } from "backend/users/users.types";
import { NextApiRequest } from "next";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest & { user?: IAccountUser },
  config?: unknown
) => Promise<T>;
