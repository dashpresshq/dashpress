import { createAuthenticatedMocks } from "__tests__/api/_test-utils";
import { requestHandler } from "backend/lib/request";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { fakeMessageDescriptor } from "translations/fake";

const TEST_FORM_SCHEMA: IAppliedSchemaFormConfig<{ name: string }> = {
  name: {
    label: fakeMessageDescriptor("Name"),
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

const handler = requestHandler({
  POST: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "requestBody",
        options: TEST_FORM_SCHEMA,
      },
    ]);
    return validatedRequest.requestBody;
  },
});

describe("Request Validations => requestBodyValidationImpl", () => {
  it("should return correct data when valid body is passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "foo",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "foo",
      }
    `);
  });

  it("should return error when invalid body is passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        invalid: "body",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Invalid Request",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
        "validations": {
          "name": "Name is required",
        },
      }
    `);
  });

  it("should return programming error when validation schema is not passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "foo",
      },
    });

    await requestHandler({
      POST: async (getValidatedRequest) => {
        const validatedRequest = await getValidatedRequest(["requestBody"]);
        return validatedRequest.requestBody;
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Please provide the request validation",
        "method": "POST",
        "path": "",
        "statusCode": 500,
      }
    `);
  });
});
