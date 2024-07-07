import { requestHandler } from "@/backend/lib/request";
import { createAuthenticatedMocks } from "@/tests/api/setups";
import { createUnAuthenticatedMocks } from "@/tests/api/setups/_authenticatedMock";

const handler = requestHandler(
  {
    GET: async () => {
      return { foo: "bar" };
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);

describe("Request Validations => guestValidationImpl", () => {
  it("should return data when request is not authenticated", async () => {
    const { req, res } = createUnAuthenticatedMocks({
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

  it("should return error when request is authenticated", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
                {
                  "errorCode": "ALREADY_AUTHENTICATED",
                  "message": "You are already authenticated, Please logout to continue with request",
                  "method": "GET",
                  "name": "UnauthorizedError",
                  "path": "",
                  "statusCode": 401,
                }
              `);
  });
});
