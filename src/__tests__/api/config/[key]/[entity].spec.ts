import handler from "@/pages/api/config/[key]/[entity]";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

describe("/api/config/[key]/[entity]", () => {
  beforeAll(async () => {
    await setupAllTestData(["app-config", "schema"]);
  });

  it("should return save keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      singular: "Base Model Singular",
      plural: "Base Model Plural",
    });
  });

  it("should request for entity when required", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_diction",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Configuration of key 'entity_diction' requires entity",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should return default value for empty entity keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "secondary-model",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      singular: "",
      plural: "",
    });
  });

  it("should return default value for empty config key", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "hidden_entity_table_columns",
        entity: "base-model",
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
        entity: "base-model",
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
        key: "entity_diction",
        entity: "base-model",
      },
      body: {
        data: {
          singular: "Singular Updated",
          plural: "Plural Updated",
        },
      },
    });

    await handler(putReq.req, putReq.res);

    expect(putReq.res._getStatusCode()).toBe(204);

    const getReq = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "base-model",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual({
      singular: "Singular Updated",
      plural: "Plural Updated",
    });
  });

  it("should create config when not present for entity", async () => {
    const putReq = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "entity_diction",
        entity: "secondary-model",
      },
      body: {
        data: {
          singular: "New Singular",
          plural: "New Plural",
        },
      },
    });

    await handler(putReq.req, putReq.res);

    expect(putReq.res._getStatusCode()).toBe(204);

    const getReq = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "secondary-model",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual({
      singular: "New Singular",
      plural: "New Plural",
    });
  });

  it("should create config when not config key is not present", async () => {
    const putReq = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "entity_columns_labels",
        entity: "base-model",
      },
      body: {
        data: {
          userName: "User Name",
          updatedAt: "Last Login",
        },
      },
    });

    await handler(putReq.req, putReq.res);

    expect(putReq.res._getStatusCode()).toBe(204);

    const getReq = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entity_columns_labels",
        entity: "base-model",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual({
      userName: "User Name",
      updatedAt: "Last Login",
    });
  });
});
