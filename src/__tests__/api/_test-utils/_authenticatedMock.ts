import { createMocks, RequestOptions } from "node-mocks-http";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9vdCBVc2VyIiwicm9sZSI6ImNyZWF0b3IiLCJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2NjA4MjAzNTksImV4cCI6ODY0MDE2NjA3MzM5NTl9.5YlccsGd3_DysFzS-9LsoX8C4e0AJrRZhLT-epirAu4";

const authorizedHeader = {
  headers: {
    authorization: `Bearer ${AUTH_TOKEN}`,
  },
};

export const createAuthenticatedMocks = (mock: RequestOptions) => {
  return createMocks({ ...mock, ...authorizedHeader });
};
