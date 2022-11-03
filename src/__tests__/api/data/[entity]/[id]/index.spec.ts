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
        "message": "Entity 'tests' with id '1' is not found",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 404,
      }
    `);
    });
  });
});
