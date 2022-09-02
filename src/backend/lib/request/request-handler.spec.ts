import { createAuthenticatedMocks } from "__tests__/api/_test-utils";
import { requestHandler } from "../request";
import { BadRequestError } from "../errors";

describe("/api/requestHandler", () => {
  it("should call 'GET' correctly and pass queries", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
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
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        entity: "base-model",
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
          foo: (await getValidatedRequest(["entityRequestBody"]))
            .entityRequestBody,
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
    const { req, res } = createAuthenticatedMocks({
      method: "OPTIONS",
    });

    await requestHandler({})(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toBe("Method 'OPTIONS' Not Allowed");
  });

  it("should call handle errors thrown to HTTP responses", async () => {
    const { req, res } = createAuthenticatedMocks({
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
        "method": "PUT",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
