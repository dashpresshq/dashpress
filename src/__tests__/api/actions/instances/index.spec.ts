import handler from "pages/api/actions/instances/index";
import getHandler from "pages/api/actions/instances/[key]";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("nano-id-1")
    .mockReturnValueOnce("nano-id-2"),
}));

describe("/api/actions/instances/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["action_instances"]);
  });

  it("should instantiate actions", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        activatedActionId: "smtp-activation-id-1",
        entity: "test-entity",
        implementationKey: "SEND_MESSAGE",
        triggerLogic: "some trigger logic",
        formAction: "update",
        configuration: {
          to: "me",
          subject: "something important",
          body: "You are awesome",
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should instantiate HTTP action", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        activatedActionId: "DEFAULT",
        entity: "test-entity",
        implementationKey: "PUT",
        triggerLogic: "some trigger logic",
        formAction: "create",
        configuration: {
          url: "/some-where",
          body: '{"me": "you"}',
          headers: '{"me": "you"}',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should not instantiate action for unknown activationId", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        activatedActionId: "THIS_ACTIVATION_ID_DOES_NOT_EXIST",
        entity: "test-entity-2",
        implementationKey: "GET",
        triggerLogic: "some trigger logic",
        formAction: "update",
        configuration: {
          bad: '{"request": "hello"}',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Integration Key not found for activatedActionId 'THIS_ACTIVATION_ID_DOES_NOT_EXIST'",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should show all the added action instances", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "test-entity",
      },
    });
    await getHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "activatedActionId": "smtp-activation-id-1",
          "configuration": {
            "body": "You are awesome",
            "subject": "something important",
            "to": "me",
          },
          "entity": "test-entity",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "nano-id-1",
          "integrationKey": "smtp",
          "triggerLogic": "some trigger logic",
        },
        {
          "activatedActionId": "DEFAULT",
          "configuration": {
            "body": "{"me": "you"}",
            "headers": "{"me": "you"}",
            "url": "/some-where",
          },
          "entity": "test-entity",
          "formAction": "create",
          "implementationKey": "PUT",
          "instanceId": "nano-id-2",
          "integrationKey": "http",
          "triggerLogic": "some trigger logic",
        },
      ]
    `);
  });
});
