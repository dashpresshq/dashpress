import handler from "pages/api/integrations/credentials/[key]";
import revealHandler from "pages/api/integrations/credentials/reveal";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  createAuthenticatedViewerMocks,
  setupRolesTestData,
  createAuthenticatedCustomRoleMocks,
  setupUsersTestData,
} from "__tests__/api/_test-utils";

const currentState = async () => {
  const { req, res } = createAuthenticatedMocks({
    method: "POST",
    body: {
      _password: "password",
    },
  });

  await revealHandler(req, res);

  return res._getJSONData();
};

describe("/api/integrations/credentials/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials", "users"]);
  });

  describe("Plain keys => Invalid Password", () => {
    it("should not create new entry", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
          _password: "invalid_password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Invalid Password",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CREDENTIAL_KEY_1",
        },
        body: {
          _password: "invalid_password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Invalid Password",
          "method": "DELETE",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
    });
  });

  describe("Plain keys => Correct Password", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_1",
            "value": "CREDENTIAL_VALUE_1",
          },
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "CREDENTIAL_KEY_2",
        },
        body: {
          value: "UPDATED_CREDENTIAL_VALUE_2",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_1",
            "value": "CREDENTIAL_VALUE_1",
          },
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CREDENTIAL_KEY_1",
        },
        body: {
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
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
          value: "NEW_CREDENTIL_VALUE",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should not update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "DATABASE___dataSourceType",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_3",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Group keys can't be created or updated. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "DATABASE___dataSourceType",
        },
        body: {
          _password: "password",
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
        [
          {
            "key": "CREDENTIAL_KEY_2",
            "value": "UPDATED_CREDENTIAL_VALUE_2",
          },
          {
            "key": "NEW_CREDENTIAL_KEY",
            "value": "NEW_CREDENTIAL_VALUE",
          },
        ]
      `);
    });
  });

  describe("permission", () => {
    it("should return 403 when user has incorrect permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_CONFIGURE_APP"],
        },
      ]);
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
    });
    it("should work when user has correct permission", async () => {
      await Promise.all([
        setupRolesTestData([
          {
            id: "custom-role",
            permissions: ["CAN_MANAGE_INTEGRATIONS"],
          },
        ]),
        setupUsersTestData([
          {
            username: "custom-role",
            password:
              "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
            name: "Custom Role",
            role: "custom-role",
            systemProfile: "",
          },
        ]),
      ]);

      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "PUT",
        query: {
          key: "NEW_CREDENTIAL_KEY",
        },
        body: {
          value: "NEW_CREDENTIAL_VALUE",
          _password: "password",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});
