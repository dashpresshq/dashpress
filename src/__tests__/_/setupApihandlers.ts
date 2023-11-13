import { setupServer } from "msw/node";
import { JWT_TOKEN_STORAGE_KEY } from "frontend/hooks/auth/auth.store";
import { apiHandlers } from "./api-handlers";

export const server = setupServer(...apiHandlers);

export function setupApiHandlers() {
  beforeAll(() => {
    localStorage.setItem(JWT_TOKEN_STORAGE_KEY, "foo");
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  return server;
}
