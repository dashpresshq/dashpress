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
});
