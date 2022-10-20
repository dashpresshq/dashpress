import { createMocks, RequestOptions } from "node-mocks-http";

const ROOT_USER_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9vdCBVc2VyIiwicm9sZSI6ImNyZWF0b3IiLCJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2NjA4MjAzNTksImV4cCI6ODY0MDE2NjA3MzM5NTl9.5YlccsGd3_DysFzS-9LsoX8C4e0AJrRZhLT-epirAu4";

const VIEWER_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmlld2VyIFVzZXIiLCJyb2xlIjoidmlld2VyIiwidXNlcm5hbWUiOiJ2aWV3ZXIiLCJpYXQiOjE2NjYzMDM5MzUsImV4cCI6MTAzMDYzMDM5MzV9.1A-ESlL1f0626vFz7NpmsLMupX0VHX7zHmbkjydYjdI";

const authorizedHeader = (token: string) => ({
  headers: {
    authorization: `Bearer ${token}`,
  },
});

export const createAuthenticatedMocks = (mock: RequestOptions) => {
  return createMocks({ ...mock, ...authorizedHeader(ROOT_USER_AUTH_TOKEN) });
};

export const createAuthenticatedViewerMocks = (mock: RequestOptions) => {
  return createMocks({ ...mock, ...authorizedHeader(VIEWER_AUTH_TOKEN) });
};
