import handler from "pages/api/data/[entity]/[id]/index";
import {
  setupAllTestData,
  setupTestDatabaseData,
  createAuthenticatedMocks,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";

describe("/api/data/[entity]/[id]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config"]);
    await setupTestDatabaseData();
  });

  it("should show data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        id: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "age": 5,
        "createdAt": 1665615600000,
        "id": 1,
        "name": "John Doe",
        "referenceId": 3,
        "status": "closed",
        "verified": 1,
      }
    `);
  });

  it("should hide hidden columns from table data", async () => {
    await setupAppConfigTestData({
      hidden_entity_details_columns__tests: ["createdAt", "verified"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        id: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "age": 5,
        "id": 1,
        "name": "John Doe",
        "referenceId": 3,
        "status": "closed",
      }
    `);
  });
});
