import { createMocks } from "node-mocks-http";
import { requestHandler } from "../request";
import { BadRequestError } from "../errors";

describe("/api/requestHandler", () => {
  it("should call 'GET' correctly and pass queries", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        entity: "foo",
        take: "5",
        page: "15",
      },
    });

    await requestHandler({
      GET: async (getValidatedRequest) => {
        return {
          foo: (await getValidatedRequest(["paginationFilter"]))
            .paginationFilter,
        };
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      foo: {
        orderBy: "asc",
        page: 15,
        take: 5,
      },
    });
  });

  it("should call 'POST' correctly and pass body request", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        entity: "foo",
      },
      body: {
        data: {
          title: "test-title",
        },
      },
    });

    await requestHandler({
      POST: async (getValidatedRequest) => {
        return {
          foo: (await getValidatedRequest(["requestBody"])).requestBody,
        };
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toEqual({
      foo: {
        title: "test-title",
      },
    });
  });

  it("should call error on non implemented request method", async () => {
    const { req, res } = createMocks({
      method: "OPTIONS",
    });

    await requestHandler({})(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe("Method 'OPTIONS' Not Allowed");
  });

  it("should call handle errors thrown to HTTP responses", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await requestHandler({
      PUT: async () => {
        throw new BadRequestError("Name is required");
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Name is required",
        "name": "BadRequestError",
      }
    `);
  });
});
