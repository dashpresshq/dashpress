import handler from "pages/api/integrations/env/[key]";
import listHandler from "pages/api/integrations/env";
import {
  setupAllTestData,
  createAuthenticatedMocks,
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

  // should work for only CAN_CONFIGURE_APP

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
        {
          "ENV_KEY_1": "ENV_KEY_1",
          "ENV_KEY_2": "ENV_KEY_2",
          "GROUP_ENV___KEY_3": "ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
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
        {
          "ENV_KEY_1": "ENV_KEY_1",
          "ENV_KEY_2": "UPDATED_ENV_KEY_2",
          "GROUP_ENV___KEY_3": "ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
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
        {
          "ENV_KEY_2": "UPDATED_ENV_KEY_2",
          "GROUP_ENV___KEY_3": "ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
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
          "message": "Group keys can't be created. They should be updated in the plugin settings",
          "method": "PUT",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "ENV_KEY_2": "UPDATED_ENV_KEY_2",
          "GROUP_ENV___KEY_3": "ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
      `);
    });

    it("should update value for existing key", async () => {
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

      expect(res._getStatusCode()).toBe(204);

      expect(await currentState()).toMatchInlineSnapshot(`
        {
          "ENV_KEY_2": "UPDATED_ENV_KEY_2",
          "GROUP_ENV___KEY_3": "UPDATED_ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
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
        {
          "ENV_KEY_2": "UPDATED_ENV_KEY_2",
          "GROUP_ENV___KEY_3": "UPDATED_ENV_KEY_3",
          "GROUP_ENV___KEY_4": "ENV_KEY_4",
          "NEW_ENV_KEY": "NEW_ENV_VALUE",
        }
      `);
    });
  });
});
