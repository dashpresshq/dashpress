import { createMocks } from "node-mocks-http";
import handler from "pages/api/account/mine";
import signInhandler from "pages/api/auth/signin";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

describe("authenticated ", () => {
  describe("protectedRoute", () => {
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
  });

  describe("protectedRoute", () => {
    it("should return error when request is authenticated", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        body: {
          username: "root",
          password: "password",
        },
      });

      await signInhandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
                {
                  "errorCode": "ALREADY_AUTHENTICATED",
                  "message": "You are already authenticated, Please logout to continue with request",
                  "method": "POST",
                  "name": "ForbiddenError",
                  "path": "",
                  "statusCode": 401,
                }
              `);
    });
  });
});
