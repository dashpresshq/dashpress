import { createAuthenticatedMocks } from "__tests__/api/_test-utils";
import { requestHandler } from "backend/lib/request";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["entityId"]);
    return { data: validatedRequest.entityId };
  },
});

describe("Request Validations => entityIdFilterValidationImpl", () => {
  it("should return correct entityId", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        id: "4",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "4",
      }
    `);
  });

  it("should return first array element when the value is an array", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        id: ["first value", "second value"],
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "first value",
      }
    `);
  });
});
