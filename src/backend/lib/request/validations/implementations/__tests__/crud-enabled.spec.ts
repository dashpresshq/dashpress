import { requestHandler } from "backend/lib/request";
import { DataActionType } from "shared/configurations";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
  setupRolesTestData,
} from "__tests__/api/_test-utils";
import { GranularEntityPermissions } from "shared/types/user";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    await getValidatedRequest([
      {
        _type: "crudEnabled",
        options: DataActionType.Details,
      },
    ]);

    return true;
  },
  POST: async (getValidatedRequest) => {
    await getValidatedRequest([
      {
        _type: "crudEnabled",
        options: DataActionType.Create,
      },
    ]);
    return true;
  },
  DELETE: async (getValidatedRequest) => {
    await getValidatedRequest([
      {
        _type: "crudEnabled",
        options: DataActionType.Delete,
      },
    ]);
  },
  PATCH: async (getValidatedRequest) => {
    await getValidatedRequest([
      {
        _type: "crudEnabled",
        options: DataActionType.Update,
      },
    ]);
    return true;
  },
  PUT: async (getValidatedRequest) => {
    await getValidatedRequest([
      {
        _type: "crudEnabled",
        options: DataActionType.Reference,
      },
    ]);
    return true;
  },
});

describe("Request Validations => crudEnabledValidationImpl", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "users", "roles", "app-config"]);
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

    it("should pass for enabled PUT as 'Reference' is not in the list", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(204);
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

    it("should pass for enabled PUT as 'Reference' is not in the list", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);
      expect(res._getStatusCode()).toBe(204);
    });
  });

  describe("ACCESS", () => {
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

    it("should allow users who can access entity see the entity", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: [
            META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
              "tests",
              GranularEntityPermissions.Show
            ),
          ],
        },
      ]);
      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "GET",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it("should not allow users who can't access entity see the entity", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: [
            META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
              "base-model",
              GranularEntityPermissions.Show
            ),
          ],
        },
      ]);
      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "GET",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);

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
  });
});
