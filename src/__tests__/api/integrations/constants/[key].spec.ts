import handler from "pages/api/integrations/constants/[key]";
import listHandler from "pages/api/integrations/constants";
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

describe("/api/integrations/constants/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["constants"]);
  });

  describe("Plain keys", () => {
    it("should create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CONSTANT_KEY_1": "CONSTANT_KEY_1",
          "CONSTANT_KEY_2": "CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "CONSTANT_KEY_2",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_2",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CONSTANT_KEY_1": "CONSTANT_KEY_1",
          "CONSTANT_KEY_2": "UPDATED_CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });

    it("should delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "CONSTANT_KEY_1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CONSTANT_KEY_2": "UPDATED_CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });
  });

  describe("Group keys", () => {
    it("should not create new entry for non-existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT___KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
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
          "CONSTANT_KEY_2": "UPDATED_CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });

    it("should update value for existing key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PUT",
        query: {
          key: "GROUP_CONSTANT___KEY_3",
        },
        body: {
          value: "UPDATED_CONSTANT_KEY_3",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "CONSTANT_KEY_2": "UPDATED_CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "UPDATED_CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });

    it("should not delete key", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "GROUP_CONSTANT___KEY_3",
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
          "CONSTANT_KEY_2": "UPDATED_CONSTANT_KEY_2",
          "GROUP_CONSTANT___KEY_3": "UPDATED_CONSTANT_KEY_3",
          "GROUP_CONSTANT___KEY_4": "CONSTANT_KEY_4",
          "NEW_CONSTANT_KEY": "NEW_CONSTANT_VALUE",
        }
      `);
    });
  });

  describe("permission", () => {
    it("should return 401 when user has no permission", async () => {
      const { req, res } = createAuthenticatedViewerMocks({
        method: "PUT",
        query: {
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(401);
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
          key: "NEW_CONSTANT_KEY",
        },
        body: {
          value: "NEW_CONSTANT_VALUE",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });
  });
});
