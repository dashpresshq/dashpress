import { requestHandler } from "backend/lib/request";
import { createMocks } from "node-mocks-http";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["authenticatedUser"]);
    return validatedRequest.authenticatedUser;
  },
});

describe("Request Validations => authenticatedUserValidationImpl", () => {
  it("should return authenticated user", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "exp": 86401660733959,
        "iat": 1660820359,
        "name": "Root User",
        "role": "creator",
        "username": "root",
      }
    `);
  });

  it("should programming error when called on a guest route", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async (getValidatedRequest) => {
          const validatedRequest = await getValidatedRequest([
            "authenticatedUser",
          ]);

          return validatedRequest.authenticatedUser;
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "A non authenticated route tried to access user from request",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });

  it("should run isAuthenticated validation before authenticatedUser", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async (getValidatedRequest) => {
          const validatedRequest = await getValidatedRequest([
            "authenticatedUser",
          ]);

          return validatedRequest.authenticatedUser;
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "ALREADY_AUTHENTICATED",
        "message": "You are already authenticated, Please logout to continue with request",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });
});
