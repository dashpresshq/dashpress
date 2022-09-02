import { rest } from "msw";
import { setupServer } from "msw/node";

import { setupHandlers } from "./setup";
import { accountHandlers } from "./account";
import { authHandlers } from "./auth";

export const serverHandlers = [
  ...setupHandlers,
  ...authHandlers,
  ...accountHandlers,
];

const server = setupServer(...serverHandlers);

export { server, rest };
