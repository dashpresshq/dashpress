import handler from "pages/api/data/[entity]/index";
import {
  setupAllTestData,
  setupTestDatabaseData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/data/[entity]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config"]);
    await setupTestDatabaseData();
  });

  it("should list data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "John Doe",
          "value": 1,
        },
        Object {
          "label": "Jane Doe",
          "value": 2,
        },
      ]
    `);
  });

  it.skip("should search list data", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        search: "John",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "John Doe",
          "value": 1,
        },
      ]
    `);
  });
});
