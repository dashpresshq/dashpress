import { NextApiRequest } from "next";
import { IAccountProfile } from "shared/types/user";

export type ValidationImplType<T extends unknown> = (
  req: NextApiRequest & { user?: IAccountProfile },
  config?: unknown
) => Promise<T>;

export const FOR_CODE_COV = 1;
