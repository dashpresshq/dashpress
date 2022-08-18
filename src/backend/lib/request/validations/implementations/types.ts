import { NextApiRequest } from "next";
import { IAccountUser } from "shared/types";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest & { user?: Omit<IAccountUser, "password"> },
  config?: unknown
) => Promise<T>;
