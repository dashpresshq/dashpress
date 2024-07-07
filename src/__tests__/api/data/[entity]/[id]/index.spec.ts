import handler from "@/pages/api/data/[entity]/[id]/index";
import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "@/tests/api/setups";

describe("/api/data/[entity]/[id]/index", () => {
  beforeAll(async () => {
    await setupAllTestData([
      "schema",
      "credentials",
      "app-config",
      "data",
      "form-actions",
    ]);
  });

  describe("GET", () => {
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
              {
                "age": 5,
                "createdAt": 1660735797330,
                "id": 1,
                "name": "John Doe",
                "referenceId": 3,
                "status": "closed",
                "verified": 1,
              }
          `);
    });

    it("should query data by the column when present", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: "Jane Doe",
          column: "name",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "age": 9,
          "createdAt": 1631878197330,
          "id": 2,
          "name": "Jane Doe",
          "referenceId": 5,
          "status": "opened",
          "verified": 0,
        }
      `);
    });

    it("should validate the column param", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: "Jane Doe",
          column: "invalid-field",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Invalid field 'invalid-field' for 'tests'",
          "method": "GET",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
    });

    it("should hide hidden columns from details data", async () => {
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
              {
                "age": 5,
                "id": 1,
                "name": "John Doe",
                "referenceId": 3,
                "status": "closed",
              }
          `);
    });

    it("should disable showing data when CRUD setting is turned off for details", async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: true,
          details: false,
          update: true,
          delete: true,
        },
      });

      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'details' has been disabled for 'tests'",
          "method": "GET",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 403,
        }
      `);
    });
  });

  describe("PATCH", () => {
    beforeAll(async () => {
      await setupAppConfigTestData({
        hidden_entity_details_columns__tests: [],
      });
    });

    it("should update data", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
          id: 1,
        },
        body: {
          data: {
            age: 6,
            createdAt: new Date("2032-08-17T11:29:57.330Z"),
            name: "John Doe Updated",
            referenceId: 6,
            status: "opened",
            verified: false,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(200);
      expect(detailsMock.res._getJSONData()).toMatchInlineSnapshot(`
          {
            "age": 6,
            "createdAt": 1976354997330,
            "id": 1,
            "name": "John Doe Updated",
            "referenceId": 6,
            "status": "opened",
            "verified": 0,
          }
        `);
    });

    it("should update only allowed fields", async () => {
      await setupAppConfigTestData({
        hidden_entity_update_columns__tests: ["referenceId"],
      });

      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
          id: 1,
        },
        body: {
          data: {
            age: 6,
            createdAt: new Date("2032-08-17T11:29:57.330Z"),
            name: "John Doe Updated Again",
            referenceId: 4444,
            status: "opened",
            verified: false,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(200);
      expect(detailsMock.res._getJSONData()).toMatchInlineSnapshot(`
          {
            "age": 6,
            "createdAt": 1976354997330,
            "id": 1,
            "name": "John Doe Updated Again",
            "referenceId": 6,
            "status": "opened",
            "verified": 0,
          }
        `);
    });

    it("should disable updation when CRUD setting is turned off for update", async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: true,
          details: true,
          update: false,
          delete: true,
        },
      });

      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
          id: 1,
        },
        body: {
          data: {
            age: 99,
            createdAt: new Date("2032-08-17T11:29:57.330Z"),
            name: "DO NOT BE UPDATED",
            referenceId: 9999,
            status: "closed",
            verified: false,
          },
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'update' has been disabled for 'tests'",
          "method": "PATCH",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 403,
        }
      `);

      const detailsMock = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(detailsMock.req, detailsMock.res);

      expect(detailsMock.res._getStatusCode()).toBe(200);
      expect(detailsMock.res._getJSONData()).toMatchInlineSnapshot(`
          {
            "age": 6,
            "createdAt": 1976354997330,
            "id": 1,
            "name": "John Doe Updated Again",
            "referenceId": 6,
            "status": "opened",
            "verified": 0,
          }
        `);
    });
  });

  describe("DELETE", () => {
    it("should delete data", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);

      const { req: getReq, res: getRes } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await handler(getReq, getRes);

      expect(getRes._getStatusCode()).toBe(404);
      expect(getRes._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "Entity 'tests' with 'id' '1' does not exist",
                "method": "GET",
                "name": "NotFoundError",
                "path": "",
                "statusCode": 404,
              }
          `);
    });

    it("should disable deletion when CRUD setting is turned off for delete", async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: true,
          details: true,
          update: true,
          delete: false,
        },
      });

      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          entity: "tests",
          id: 2,
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'delete' has been disabled for 'tests'",
          "method": "DELETE",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 403,
        }
      `);

      const { req: getReq, res: getRes } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          id: 2,
        },
      });

      await handler(getReq, getRes);

      expect(getRes._getStatusCode()).toBe(200);
    });
  });
});
