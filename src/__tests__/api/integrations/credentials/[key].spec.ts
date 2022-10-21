import handler from "pages/api/integrations/credentials/[key]";
import listHandler from "pages/api/integrations/credentials";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  createAuthenticatedViewerMocks,
  setupRolesTestData,
  createAuthenticatedCustomRoleMocks,
} from "__tests__/api/_test-utils";

const currentState = async () => {
  const { req, res } = createAuthenticatedMocks({
    method: "GET",
  });

  await listHandler(req, res);

  return res._getJSONData();
};

describe("/api/integrations/credentials/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
  });

  describe("Plain keys", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CREDENTIAL_KEY_1": "XXXYYZ",
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "DATABASE___dataSourceType",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_2",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CREDENTIAL_KEY_1": "XXXYYZ",
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CREDENTIAL_KEY_1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });
  });

  describe("Group keys", () => {
    it("should not create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL___KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "DATABASE___port",
        },
        body: {
          value: "UPDATED_CREDENTIAL_KEY_3",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "DATABASE___port",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be deleted. They will be removed when the plugin is removed",
          "method": "DELETE",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "DATABASE___connectionString": "XXXYYZ",
          "DATABASE___dataSourceType": "XXXYYZ",
          "DATABASE___port": "XXXYYZ",
          "NEW_CREDENTIAL_KEY": "XXXYYZ",
        }
      `);
    });
  });

  describe("permission", () => {
    it("should return 401 when user has no permission", async () => {
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
    });
    it("should work when user has correct permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_MANAGE_CREDENTIALS"],
        },
      ]);

      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});
