import { requestHandler } from "@/backend/lib/request";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["queryFilters"]);
    return { data: validatedRequest.queryFilters };
  },
});

describe("Request Validations => queryFilterValidationImpl", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials", "schema"]);
  });

  it("should return correct filters", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        "filters[0][id]": "id",
        "filters[0][value][operator]": "e",
        "filters[0][value][value]": 1,
        "filters[1][id]": "name",
        "filters[1][value][operator]": "l",
        "filters[1][value][value]": 5,
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": {
          "children": [
            {
              "id": "id",
              "value": {
                "operator": "e",
                "value": "1",
              },
            },
            {
              "id": "name",
              "value": {
                "operator": "l",
                "value": "5",
              },
            },
          ],
          "operator": "and",
        },
      }
    `);
  });

  it("should return empty array when there no filters", async () => {
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
          "children": [],
          "operator": "and",
        },
      }
    `);
  });

  it("should return 404 on invalid entity", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "invalid-entity",
        "filters[0][id]": "id",
        "filters[0][value][operator]": "e",
        "filters[0][value][value]": 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "This resource doesn't exist or is disabled or you dont have access to it",
        "method": "GET",
        "name": "NotFoundError",
        "path": "",
        "statusCode": 404,
      }
    `);
  });

  it("should return error on invalid entity field", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        "filters[0][id]": "some-invalid-field",
        "filters[0][value][operator]": "e",
        "filters[0][value][value]": 1,
        "filters[1][id]": "name",
        "filters[1][value][operator]": "l",
        "filters[1][value][value]": 5,
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Invalid field 'some-invalid-field' for 'tests'",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
