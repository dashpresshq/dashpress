import { setupServer } from "msw/node";
import { apiHandlers } from "./api-handlers";

const server = setupServer(...apiHandlers);

export function setupApiHandlers() {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());
}

// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
