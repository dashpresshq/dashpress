import type { NextApiRequest, NextApiResponse } from "next";
import { noop } from "shared/lib/noop";

export const requestHook = async (
  req: NextApiRequest,
  fn: () => Promise<void | NextApiResponse>
) => {
  noop(req);
  return await fn();
};
