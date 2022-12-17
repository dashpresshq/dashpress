import { createMocks, Mocks, RequestOptions } from "node-mocks-http";

const ROOT_USER_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9vdCBVc2VyIiwicm9sZSI6ImNyZWF0b3IiLCJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2NjA4MjAzNTksImV4cCI6ODY0MDE2NjA3MzM5NTl9.5YlccsGd3_DysFzS-9LsoX8C4e0AJrRZhLT-epirAu4";

const VIEWER_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmlld2VyIFVzZXIiLCJyb2xlIjoidmlld2VyIiwidXNlcm5hbWUiOiJ2aWV3ZXIiLCJpYXQiOjE2NjYzMDM5MzUsImV4cCI6MTAzMDYzMDM5MzV9.1A-ESlL1f0626vFz7NpmsLMupX0VHX7zHmbkjydYjdI";

const CUSTOM_ROLE_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ3VzdG9tIFJvbGUiLCJyb2xlIjoiY3VzdG9tLXJvbGUiLCJ1c2VybmFtZSI6ImN1c3RvbS1yb2xlIiwic3lzdGVtUHJvZmlsZSI6IiIsImlhdCI6MTY2NjQ2OTk1MiwiZXhwIjoyNTMwNDY5OTUyfQ.SyOxU6QciFWkXAiVGYRbPOgg3Y2nbveuLhX3G13sjdM";

const authorizedHeader = (token: string) => ({
  headers: {
    authorization: `Bearer ${token}`,
  },
});

export const createUnAuthenticatedMocks = (
  mock: RequestOptions
): Mocks<any, any> => {
  return createMocks({ ...mock });
};

export const createAuthenticatedMocks = (
  mock: RequestOptions
): Mocks<any, any> => {
  return createMocks({ ...mock, ...authorizedHeader(ROOT_USER_AUTH_TOKEN) });
};

export const createAuthenticatedViewerMocks = (
  mock: RequestOptions
): Mocks<any, any> => {
  return createMocks({ ...mock, ...authorizedHeader(VIEWER_AUTH_TOKEN) });
};

export const createAuthenticatedCustomRoleMocks = (
  mock: RequestOptions
): Mocks<any, any> => {
  return createMocks({ ...mock, ...authorizedHeader(CUSTOM_ROLE_AUTH_TOKEN) });
};
