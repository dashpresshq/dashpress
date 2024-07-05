import handler from "pages/api/integrations/env/[key]";
import listHandler from "pages/api/integrations/env";
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

describe("/api/integrations/env/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["environment-variables"]);
  });

  describe("Plain keys", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_ENV_KEY",
        },
        body: {
          value: "NEW_ENV_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "ENV_KEY_1",
            "value": "ENV_KEY_1",
          },
          {
            "key": "ENV_KEY_2",
            "value": "ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
          },
        ]
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "ENV_KEY_2",
        },
        body: {
          value: "UPDATED_ENV_KEY_2",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "ENV_KEY_1",
            "value": "ENV_KEY_1",
          },
          {
            "key": "ENV_KEY_2",
            "value": "UPDATED_ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
          },
        ]
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "ENV_KEY_1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        [
          {
            "key": "ENV_KEY_2",
            "value": "UPDATED_ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
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
          key: "NEW_ENV___KEY",
        },
        body: {
          value: "NEW_ENV_VALUE",
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
            "key": "ENV_KEY_2",
            "value": "UPDATED_ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
          },
        ]
      `);
    });

    it("should not update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "GROUP_ENV___KEY_3",
        },
        body: {
          value: "UPDATED_ENV_KEY_3",
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
            "key": "ENV_KEY_2",
            "value": "UPDATED_ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
          },
        ]
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "GROUP_ENV___KEY_3",
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
            "key": "ENV_KEY_2",
            "value": "UPDATED_ENV_KEY_2",
          },
          {
            "key": "NEW_ENV_KEY",
            "value": "NEW_ENV_VALUE",
          },
        ]
      `);
    });
  });

  describe("permission", () => {
    it("should return 403 when user has no permission", async () => {
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_ENV_KEY",
        },
        body: {
          value: "NEW_ENV_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(403);
    });

    it("should work when user has correct permission", async () => {
      await setupRolesTestData([
        {
          id: "custom-role",
          permissions: ["CAN_CONFIGURE_APP"],
        },
      ]);

      const { req, res } = createAuthenticatedCustomRoleMocks({
        method: "PUT",
        query: {
          key: "NEW_ENV_KEY",
        },
        body: {
          value: "NEW_ENV_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});
