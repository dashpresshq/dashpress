import { requestHandler } from "backend/lib/request";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["configKey"]);
    return validatedRequest.configKey;
  },
});

describe("Request Validations => configKeyFilterValidationImpl", () => {
  it("should return config key", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "theme_color",
      },
    });

    await handler(req, res);

    expect(res._getData()).toBe('"theme_color"');
  });

  it("should return error for invalid config key", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "some-invalid-key",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Configuration key 'some-invalid-key' doesn't exist",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should return error for no config key", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Configuration key 'undefined' doesn't exist",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should return error for entity config keys when the entity is not passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_views",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Configuration of key 'entity_views' requires entity",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should return entity config key", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_views",
        entity: "foo",
      },
    });

    await handler(req, res);

    expect(res._getData()).toBe('"entity_views"');
  });
});
