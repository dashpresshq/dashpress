import handler from "pages/api/config/[key]/index";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/config/[key]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["app-config", "schema"]);
  });

  it("should return saved keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "disabled_entities",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([
      "disabled-entity-1",
      "disabled-entity-2",
    ]);
  });

  it("should return default value for empty keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "menu_entities_order",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  it("should return 400 for invalid keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "some invalid key",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Configuration key 'some invalid key' doesn't exist",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should update config when present", async () => {
    const putReq = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "disabled_entities",
      },
      body: {
        data: ["updated-1", "updated-2"],
      },
    });

    await handler(putReq.req, putReq.res);

    expect(putReq.res._getStatusCode()).toBe(204);

    const getReq = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "disabled_entities",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual(["updated-1", "updated-2"]);
  });

  it("should create config when not present", async () => {
    const putReq = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "menu_entities_order",
      },
      body: {
        data: ["order-1", "order-2"],
      },
    });

    await handler(putReq.req, putReq.res);

    expect(putReq.res._getStatusCode()).toBe(204);

    const getReq = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "menu_entities_order",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual(["order-1", "order-2"]);
  });

  describe("App config key validation", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterEach(() => {
      process.env = OLD_ENV;
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
          key: "table_views",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "Configuration of key 'table_views' requires entity",
                "method": "GET",
                "name": "BadRequestError",
                "path": "",
                "statusCode": 400,
              }
          `);
    });

    it("should throw error when updating a restricted config on demo", async () => {
      process.env.NEXT_PUBLIC_IS_DEMO = "true";

      const putReq = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "disabled_entities",
        },
        body: {
          data: ["updated-1", "updated-3"],
        },
      });

      await handler(putReq.req, putReq.res);

      expect(putReq.res._getStatusCode()).toBe(400);
      expect(putReq.res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "This action is not available on the demo site",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      const getReq = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "disabled_entities",
        },
      });

      await handler(getReq.req, getReq.res);

      expect(getReq.res._getStatusCode()).toBe(200);
      expect(getReq.res._getJSONData()).toEqual(["updated-1", "updated-2"]);
    });
  });
});
