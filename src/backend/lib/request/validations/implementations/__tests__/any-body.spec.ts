import { requestHandler } from "backend/lib/request";
import { createMocks } from "node-mocks-http";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler(
  {
    GET: async () => {
      return { foo: "bar" };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);

describe("Request Validations => anyBodyValidationImpl", () => {
  it("should work for authenticated users", async () => {
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

  it("should work for guest users", async () => {
    const { req, res } = createMocks({
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
