import { requestHandler } from "backend/lib/request";
import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";

const handler = requestHandler(
  {
    GET: async () => {
      return true;
    },
    POST: async () => {
      return true;
    },
    DELETE: async () => {
      return true;
    },
    PATCH: async () => {
      return true;
    },
  },
  [
    {
      _type: "canCrud",
    },
  ]
);

describe("Request Validations => canCrudValidationImpl", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "users", "roles"]);
  });
  it("should throw error on invalid entity", async () => {
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

  describe("ALL PASS", () => {
    beforeAll(async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: true,
          details: true,
          update: true,
          delete: true,
        },
      });
    });

    it("should pass for enabled POST", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(201);
    });

    it("should pass for enabled GET", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });

    it("should pass for enabled DELETE", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(204);
    });

    it("should pass for enabled PATCH", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
    });
  });
  describe("ALL FAIL", () => {
    beforeAll(async () => {
      await setupAppConfigTestData({
        entity_crud_settings__tests: {
          create: false,
          details: false,
          update: false,
          delete: false,
        },
      });
    });

    it("should fail for disabled POST", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'create' has been disabled for 'tests'",
          "method": "POST",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 401,
        }
      `);
    });

    it("should fail for disabled GET", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'details' has been disabled for 'tests'",
          "method": "GET",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 401,
        }
      `);
    });

    it("should fail for disabled DELETE", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'delete' has been disabled for 'tests'",
          "method": "DELETE",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 401,
        }
      `);
    });

    it("should fail for disabled PATCH", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(401);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "errorCode": "",
          "message": "Action 'update' has been disabled for 'tests'",
          "method": "PATCH",
          "name": "ForbiddenError",
          "path": "",
          "statusCode": 401,
        }
      `);
    });
  });
});
