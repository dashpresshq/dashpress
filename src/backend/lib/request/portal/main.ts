import { noop } from "shared/lib/noop";
import type { NextApiRequest, NextApiResponse } from "next";

export const requestHook = async (
  req: NextApiRequest,
  fn: () => Promise<void | NextApiResponse>
) => {
  noop(req);
  return await fn();
};
