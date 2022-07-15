import { createMocks } from "node-mocks-http";
import handler from "../../../../pages/api/config/[key]/[entity]";

describe("/api/config/[key]/[entity]", () => {
  it("should return save keys", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "foo",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      singular: "Singular Foo",
      plural: "Plural Foo",
    });
  });

  it("should request for entity when required", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "entity_diction",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Configuration of key 'entity_diction' requires entity",
        "name": "BadRequestError",
      }
    `);
  });

  it("should return default value for empty entity keys", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "bar",
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
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "hidden_entity_table_columns",
        entity: "foo",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  it("should return 400 for invalid keys", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "some invalid key",
        entity: "foo",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Configuration doesn't key 'some invalid key' doesn't exist",
      name: "BadRequestError",
    });
  });
  //
  it("should update config when present", async () => {
    const putReq = createMocks({
      method: "PUT",
      query: {
        key: "entity_diction",
        entity: "foo",
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

    const getReq = createMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "foo",
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
    const putReq = createMocks({
      method: "PUT",
      query: {
        key: "entity_diction",
        entity: "bar",
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

    const getReq = createMocks({
      method: "GET",
      query: {
        key: "entity_diction",
        entity: "bar",
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
    const putReq = createMocks({
      method: "PUT",
      query: {
        key: "entity_columns_labels",
        entity: "foo",
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

    const getReq = createMocks({
      method: "GET",
      query: {
        key: "entity_columns_labels",
        entity: "foo",
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
