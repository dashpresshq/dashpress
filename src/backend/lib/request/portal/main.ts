import noop from "lodash/noop";
import { NextApiRequest, NextApiResponse } from "next";

export const requestHook = async (
  req: NextApiRequest,
  fn: () => Promise<void | NextApiResponse>
) => {
  noop(req);
  return await fn();
};
