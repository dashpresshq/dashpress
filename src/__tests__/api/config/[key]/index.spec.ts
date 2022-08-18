import handler from "pages/api/config/[key]/index";
import { createAuthenticatedMocks } from "__tests__/helpers";

// TODO check that the before enttity keys are empty before testing

describe("/api/config/[key]/index", () => {
  it("should return saved keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "disabled_entities",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(["bar", "baz"]);
  });

  it("should return default value for empty keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "entities_order",
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
      Object {
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
        key: "entities_order",
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
        key: "entities_order",
      },
    });

    await handler(getReq.req, getReq.res);

    expect(getReq.res._getStatusCode()).toBe(200);
    expect(getReq.res._getJSONData()).toEqual(["order-1", "order-2"]);
  });
});
