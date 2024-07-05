import { createAuthenticatedMocks } from "__tests__/api/_test-utils";
import { requestHandler } from "backend/lib/request";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "requestQuery",
        options: "goodKey",
      },
    ]);
    return { data: validatedRequest.requestQuery };
  },
});

describe("Request Validations => requestQueryValidationImpl", () => {
  it("should return correct queryKey", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        goodKey: "good value",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "good value",
      }
    `);
  });

  it("should return programming error when the query field is not passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        goodKey: "good value",
      },
    });

    await requestHandler({
      GET: async (getValidatedRequest) => {
        const validatedRequest = await getValidatedRequest(["requestQuery"]);
        return validatedRequest.requestQuery;
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Please provide the field to pull off the request query",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });

  it("should return programming error when the query field is not a string", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        goodKey: "good value",
      },
    });

    await requestHandler({
      GET: async (getValidatedRequest) => {
        const validatedRequest = await getValidatedRequest([
          { _type: "requestQuery", options: false },
        ]);
        return validatedRequest.requestQuery;
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Please provide the field to pull off the request query",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });
});
