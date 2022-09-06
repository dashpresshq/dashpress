import { setupServer } from "msw/node";
import { apiHandlers } from "./api-handlers";

export const server = setupServer(...apiHandlers);

export function setupApiHandlers() {
  beforeAll(() => {
    localStorage.setItem("__auth-token__", "foo");
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  return server;
}
