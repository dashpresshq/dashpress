import handler from "pages/api/integrations/actions/[key]/index";
import activeHandler from "pages/api/integrations/actions/active";
import getHandler from "pages/api/form-actions/[key]";

import credentialsHandler from "pages/api/integrations/actions/[key]/credentials";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupFormActionsTestData } from "__tests__/api/_test-utils/_form-actions";
import { ActionIntegrations } from "shared/types/actions";
import { DataEventActions } from "shared/types/data";

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValue("nano-id-1"),
}));

describe("/api/integrations/actions/[key]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-integrations", "users"]);

    await setupFormActionsTestData([
      {
        id: "form-action-id-1",
        integration: ActionIntegrations.HTTP,
        entity: "base-model",
        action: "SEND_MESSAGE",
        trigger: DataEventActions.Create,
        configuration: {
          foo: "bar",
        },
      },
      {
        id: "form-action-id-2",
        integration: ActionIntegrations.SLACK,
        entity: "secondary-model",
        action: "POST",
        trigger: DataEventActions.Delete,
        configuration: {
          bar: "foo",
        },
      },
    ]);
  });

  describe("POST", () => {
    it("should activate an integration key and save the configurations", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          key: "slack",
        },
        body: {
          key1: "should not be saved",
          token: "value2",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);

      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
        [
          "smtp",
          "slack",
          "slack",
          "http",
        ]
      `);

      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "slack",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
        {
          "token": "value2",
        }
      `);
    });

    it("should throw error on invalid configurations", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          key: "slack",
        },
        body: {
          bad_params: "value2",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "Invalid Request",
                "method": "POST",
                "name": "BadRequestError",
                "path": "",
                "statusCode": 400,
                "validations": {
                  "token": "Token is required",
                },
              }
          `);

      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      expect(activeRes._getJSONData()).toHaveLength(4);
    });
  });

  describe("PATCH", () => {
    it("should not update action configuration when password is incorrect", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          key: "nano-id-1",
        },
        body: {
          hello: "there",
          _password: "invalid password",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "Invalid Password",
                "method": "PATCH",
                "name": "BadRequestError",
                "path": "",
                "statusCode": 400,
              }
          `);
    });

    it("should update action configuration", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          key: "slack",
        },
        body: {
          token: "updated-token",
          _password: "password",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);

      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "slack",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
              {
                "token": "updated-token",
              }
          `);
    });

    it("should throw error when updating with invalid config", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          key: "slack",
        },
        body: {
          hello: "there",
          _password: "password",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "Invalid Request",
                "method": "PATCH",
                "name": "BadRequestError",
                "path": "",
                "statusCode": 400,
                "validations": {
                  "token": "Token is required",
                },
              }
          `);

      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "slack",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
            {
              "token": "updated-token",
            }
        `);
    });
  });

  describe("DELETE", () => {
    it("should list integration form actions", async () => {
      const { req: getReq, res: resReq } = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "secondary-model",
        },
      });
      await getHandler(getReq, resReq);

      expect(resReq._getStatusCode()).toBe(200);

      expect(resReq._getJSONData()).toHaveLength(1);
    });

    it("should deactivate activated actions", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "slack",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });

    it("should remove activated action", async () => {
      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
        [
          "smtp",
          "http",
        ]
      `);
    });

    it("should remove access to credentials", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "slack",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(400);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "No credentials available for ACTION__SLACK",
          "method": "POST",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
    });

    it("should delete all form actions", async () => {
      const { req: getReq, res: resReq } = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "secondary-model",
        },
      });
      await getHandler(getReq, resReq);

      expect(resReq._getJSONData()).toHaveLength(0);
    });
  });
});
