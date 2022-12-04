import { requestHandler } from "backend/lib/request";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["paginationFilter"]);
    return { data: validatedRequest.paginationFilter };
  },
});

describe("Request Validations => paginationFilterValidationImpl", () => {
  beforeAll(() => {
    setupAllTestData(["schema"]);
  });
  it("should return correct pagination object", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        take: 40,
        page: 20,
        orderBy: "desc",
        sortBy: "id",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": {
          "orderBy": "desc",
          "page": 20,
          "sortBy": "id",
          "take": 40,
        },
      }
    `);
  });

  it("should return good default pagination object", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": {
          "orderBy": "asc",
          "page": 1,
          "take": 10,
        },
      }
    `);
  });

  it("should return 404 on invalid entity", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "invalid-entity",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "This resource doesn't exist or is disabled or you dont have access to it",
          "method": "GET",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 404,
        }
      `);
  });

  it("should return error on invalid sortBy as entity field", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        sortBy: "some-invalid-field",
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Invalid field 'some-invalid-field' for tests",
          "method": "GET",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
  });

  it("should normalize bad orderBy field to 'asc'", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        orderBy: "some-invalid-order-by",
      },
    });

    await handler(req, res);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": {
          "orderBy": "asc",
          "page": 1,
          "take": 10,
        },
      }
    `);
  });
});
