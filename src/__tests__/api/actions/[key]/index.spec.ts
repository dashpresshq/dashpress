import handler from "pages/api/actions/[key]/index";
import activeHandler from "pages/api/actions/active";
import credentialsHandler from "pages/api/actions/[key]/credentials";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupActionInstanceTestData } from "__tests__/api/_test-utils/_action-instances";

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("nano-id-1")
    .mockReturnValueOnce("nano-id-2"),
}));

describe("/api/actions/[key]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["action_instances", "users"]);

    await setupActionInstanceTestData([
      {
        instanceId: "instance-id-1",
        activatedActionId: "nano-id-1",
        integrationKey: "http",
        entity: "base-model",
        implementationKey: "SEND_MESSAGE",
        triggerLogic: "some-test-trigger-logic",
        formAction: "create",
        configuration: {
          foo: "bar",
        },
      },
      {
        instanceId: "instance-id-2",
        activatedActionId: "nano-id-1",
        integrationKey: "slack",
        entity: "secondary-model",
        implementationKey: "POST",
        triggerLogic: "another-trigger-logic",
        formAction: "delete",
        configuration: {
          bar: "foo",
        },
      },
      {
        instanceId: "instance-id-3",
        activatedActionId: "some-other-activation-id",
        integrationKey: "http",
        entity: "secondary-model",
        implementationKey: "POST",
        triggerLogic: "another-trigger-logic",
        formAction: "delete",
        configuration: {
          bar: "foo",
        },
      },
    ]);
  });

  describe("GET", () => {
    it("should show integrationKey action instances", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "http",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              [
                {
                  "activatedActionId": "nano-id-1",
                  "configuration": {
                    "foo": "bar",
                  },
                  "entity": "base-model",
                  "formAction": "create",
                  "implementationKey": "SEND_MESSAGE",
                  "instanceId": "instance-id-1",
                  "integrationKey": "http",
                  "triggerLogic": "some-test-trigger-logic",
                },
                {
                  "activatedActionId": "some-other-activation-id",
                  "configuration": {
                    "bar": "foo",
                  },
                  "entity": "secondary-model",
                  "formAction": "delete",
                  "implementationKey": "POST",
                  "instanceId": "instance-id-3",
                  "integrationKey": "http",
                  "triggerLogic": "another-trigger-logic",
                },
              ]
          `);
    });
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
                {
                  "activationId": "smtp-activation-id-1",
                  "credentialsGroupKey": "SMTP",
                  "integrationKey": "smtp",
                },
                {
                  "activationId": "slack-activation-id-2",
                  "credentialsGroupKey": "SLACK",
                  "integrationKey": "slack",
                },
                {
                  "activationId": "nano-id-1",
                  "credentialsGroupKey": "SLACK",
                  "integrationKey": "slack",
                },
                {
                  "activationId": "http",
                  "credentialsGroupKey": "none-existent",
                  "integrationKey": "http",
                },
              ]
          `);

      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "nano-id-1",
          },
          body: {
            password: "password",
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
    it("should update integration configuration", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          key: "nano-id-1",
        },
        body: {
          token: "updated-token",
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
            key: "nano-id-1",
          },
          body: {
            password: "password",
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
        method: "POST",
        query: {
          key: "slack",
        },
        body: {
          hello: "there",
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

      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "nano-id-1",
          },
          body: {
            password: "password",
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
    it("should deactivate activated actions", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "nano-id-1",
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
                {
                  "activationId": "smtp-activation-id-1",
                  "credentialsGroupKey": "SMTP",
                  "integrationKey": "smtp",
                },
                {
                  "activationId": "slack-activation-id-2",
                  "credentialsGroupKey": "SLACK",
                  "integrationKey": "slack",
                },
                {
                  "activationId": "http",
                  "credentialsGroupKey": "none-existent",
                  "integrationKey": "http",
                },
              ]
          `);
    });

    it("should remove access to credentials", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "nano-id-1",
          },
          body: {
            password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(404);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
              {
                "message": "nano-id-1 not found for 'activated_actions'",
                "method": "POST",
                "name": "BadRequestError",
                "path": "",
                "statusCode": 404,
              }
          `);
    });

    it("should delete all instances", async () => {
      const { req: getReq, res: resReq } = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "http",
        },
      });
      await handler(getReq, resReq);

      expect(resReq._getStatusCode()).toBe(200);
      expect(resReq._getJSONData()).toHaveLength(1);
    });
  });
});
