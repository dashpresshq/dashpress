import { IUser } from "backend/users/users.types";
import { NextApiRequest } from "next";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest & { user?: IUser },
  config?: unknown
) => Promise<T>;
