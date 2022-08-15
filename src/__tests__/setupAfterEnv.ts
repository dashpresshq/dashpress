import { cleanup } from "@testing-library/react";
import { server } from "./server";

import "@testing-library/jest-dom/extend-expect";

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
