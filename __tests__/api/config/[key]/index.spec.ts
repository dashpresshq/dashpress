import { createMocks } from "node-mocks-http";
import handler from "../../../../pages/api/config/[key]/index";

describe("/api/config/[key]/index", () => {
  it("should return save keys", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "disabled_entities",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(["foo", "bar", "baz"]);
  });

  it("should return default value for empty keys", async () => {
    const { req, res } = createMocks({
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
    const { req, res } = createMocks({
      method: "GET",
      query: {
        key: "some invalid key",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Configuration doesn't key 'some invalid key' doesn't exist",
      name: "BadRequestError",
    });
  });

  it("should update config when present", async () => {
    const putReq = createMocks({
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

    const getReq = createMocks({
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
    const putReq = createMocks({
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

    const getReq = createMocks({
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
