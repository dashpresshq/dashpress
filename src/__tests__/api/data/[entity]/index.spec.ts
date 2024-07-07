import detailsHandler from "@/pages/api/data/[entity]/[id]/index";
import handler from "@/pages/api/data/[entity]/index";
import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "@/tests/api/setups";

describe("/api/data/[entity]/index", () => {
  beforeAll(async () => {
    await setupAllTestData([
      "schema",
      "credentials",
      "app-config",
      "data",
      "form-actions",
    ]);
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

    it("should disable creation when CRUD setting is turned off for create", async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: false,
          details: true,
          update: true,
          delete: true,
        },
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
            id: 100,
            name: "Newly Created",
            status: "closed",
            verified: true,
            referenceId: 9,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'create' has been disabled for 'tests'",
          "method": "POST",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 403,
        }
      `);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 100,
        },
      });

      await detailsHandler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(404);
    });
  });
});

// Test entity validations implementation
