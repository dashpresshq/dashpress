import { requestHandler } from "backend/lib/request";
import { createMocks } from "node-mocks-http";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler({
  GET: async () => {
    return { foo: "bar" };
  },
});

describe("Request Validations => isAuthenticatedValidationImpl", () => {
  it("should return error when no token is passed", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
                {
                  "errorCode": "NOT_AUTHENTICATED",
                  "message": "No authorization token provided",
                  "method": "GET",
                  "name": "ForbiddenError",
                  "path": "",
                  "statusCode": 401,
                }
              `);
  });

  it("should return error when empty token is passed", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {
        authorization: `Bearer `,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
                {
                  "errorCode": "NOT_AUTHENTICATED",
                  "message": "The authorization token provided is empty",
                  "method": "GET",
                  "name": "ForbiddenError",
                  "path": "",
                  "statusCode": 401,
                }
              `);
  });

  it("should return error when invalid token is passed", async () => {
    const { req, res } = createMocks({
      method: "GET",
      headers: {
        authorization: `Bearer SOME BAD TOKEN`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
                {
                  "errorCode": "NOT_AUTHENTICATED",
                  "message": "Invalid Token",
                  "method": "GET",
                  "name": "ForbiddenError",
                  "path": "",
                  "statusCode": 401,
                }
              `);
  });

  it("should return correct data for correctly authenticated request", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "foo": "bar",
        }
      `);
  });
});
