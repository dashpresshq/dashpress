import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/data/[entity]/table";

describe("/api/data/[entity]/table", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config", "data"]);
  });

  it("should table data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "age": 5,
            "createdAt": 1660735797330,
            "id": 1,
            "name": "John Doe",
            "referenceId": 3,
            "status": "closed",
            "verified": 1,
          },
          {
            "age": 9,
            "createdAt": 1631878197330,
            "id": 2,
            "name": "Jane Doe",
            "referenceId": 5,
            "status": "opened",
            "verified": 0,
          },
        ],
        "pageIndex": 1,
        "pageSize": 10,
        "totalRecords": 2,
      }
    `);
  });

  it("should order data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        orderBy: "desc",
        sortBy: "id",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "age": 9,
            "createdAt": 1631878197330,
            "id": 2,
            "name": "Jane Doe",
            "referenceId": 5,
            "status": "opened",
            "verified": 0,
          },
          {
            "age": 5,
            "createdAt": 1660735797330,
            "id": 1,
            "name": "John Doe",
            "referenceId": 3,
            "status": "closed",
            "verified": 1,
          },
        ],
        "pageIndex": 1,
        "pageSize": 10,
        "totalRecords": 2,
      }
    `);
  });

  it("should paginate table data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        take: 1,
        page: 2,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "age": 9,
            "createdAt": 1631878197330,
            "id": 2,
            "name": "Jane Doe",
            "referenceId": 5,
            "status": "opened",
            "verified": 0,
          },
        ],
        "pageIndex": 2,
        "pageSize": 1,
        "totalRecords": 2,
      }
    `);
  });

  it("should filter table data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        "filters[0][id]": "id",
        "filters[0][value][operator]": "e",
        "filters[0][value][value]": 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "age": 5,
            "createdAt": 1660735797330,
            "id": 1,
            "name": "John Doe",
            "referenceId": 3,
            "status": "closed",
            "verified": 1,
          },
        ],
        "pageIndex": 1,
        "pageSize": 10,
        "totalRecords": 1,
      }
    `);
  });

  it("should hide hidden columns from table data", async () => {
    await setupAppConfigTestData({
      hidden_entity_table_columns__tests: ["createdAt", "verified"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "age": 5,
            "id": 1,
            "name": "John Doe",
            "referenceId": 3,
            "status": "closed",
          },
          {
            "age": 9,
            "id": 2,
            "name": "Jane Doe",
            "referenceId": 5,
            "status": "opened",
          },
        ],
        "pageIndex": 1,
        "pageSize": 10,
        "totalRecords": 2,
      }
    `);
  });
});
