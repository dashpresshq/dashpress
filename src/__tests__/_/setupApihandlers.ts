import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { setupServer } from "msw/node";

import { apiHandlers } from "./api-handlers";

export const server = setupServer(...apiHandlers);

export function setupApiHandlers() {
  beforeAll(() => {
    localStorage.setItem(AuthActions.JWT_TOKEN_STORAGE_KEY, "foo");
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  return server;
}
