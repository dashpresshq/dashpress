import { requestHandler } from "backend/lib/request";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler({
  POST: async (getValidatedRequest) => {
    const requestBody = await getValidatedRequest(["entityRequestBody"]);
    return requestBody.entityRequestBody;
  },
});

describe("Request Validations => entityRequestBodyValidationImpl", () => {
  it("should return entity request body", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        data: {
          name: "John Doe",
        },
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "John Doe",
      }
    `);
  });
});
