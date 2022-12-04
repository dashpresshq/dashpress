import { requestHandler } from "backend/lib/request";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler({
  POST: async (getValidatedRequest) => {
    const requestBody = await getValidatedRequest(["configBody"]);
    return requestBody.configBody;
  },
});

describe("Request Validations => configBodyValidationImpl", () => {
  it("should return config body", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        data: {
          hello: "there",
        },
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "hello": "there",
      }
    `);
  });
});
