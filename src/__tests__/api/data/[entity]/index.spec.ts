import handler from "pages/api/data/[entity]/index";
import detailsHandler from "pages/api/data/[entity]/[id]/index";
import {
  setupAllTestData,
  setupTestDatabaseData,
  createAuthenticatedMocks,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";

describe("/api/data/[entity]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config"]);
    await setupTestDatabaseData();
  });
  describe("GET", () => {
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
              [
                {
                  "label": "John Doe",
                  "value": 1,
                },
                {
                  "label": "Jane Doe",
                  "value": 2,
                },
              ]
          `);
    });

    // SQLITE doesn't support ilike
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

  describe("POST", () => {
    it("should create data", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          entity: "tests",
        },
        body: {
          data: {
            age: 100,
            createdAt: new Date("2022-08-17T11:29:57.330Z"),
            id: 44,
            name: "Newly Created",
            status: "closed",
            verified: true,
            referenceId: 9,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "id": 44,
              }
          `);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 44,
        },
      });

      await detailsHandler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(200);
      expect(detailsMock.res._getJSONData()).toMatchInlineSnapshot(`
        {
          "age": 100,
          "createdAt": 1660735797330,
          "id": 44,
          "name": "Newly Created",
          "referenceId": 9,
          "status": "closed",
          "verified": 1,
        }
      `);
    });

    it("should create only allowed fields", async () => {
      await setupAppConfigTestData({
        hidden_entity_create_columns__tests: ["referenceId"],
      });

      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          entity: "tests",
        },
        body: {
          data: {
            age: 100,
            createdAt: new Date("2022-08-17T11:29:57.330Z"),
            id: 45,
            name: "Newly Created",
            status: "closed",
            verified: true,
            referenceId: 9,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "id": 45,
              }
          `);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 45,
        },
      });

      await detailsHandler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(200);
      expect(detailsMock.res._getJSONData()).toMatchInlineSnapshot(`
        {
          "age": 100,
          "createdAt": 1660735797330,
          "id": 45,
          "name": "Newly Created",
          "referenceId": null,
          "status": "closed",
          "verified": 1,
        }
      `);
    });
  });
});

// Test entity validations implementation
