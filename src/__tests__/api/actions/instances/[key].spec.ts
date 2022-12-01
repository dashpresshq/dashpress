import handler from "pages/api/actions/instances/[key]";
import { HTTP_ACTIVATION_ID, IActionInstance } from "shared/types/actions";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupActionInstanceTestData } from "__tests__/api/_test-utils/_action-instances";

const TEST_ACTION_INSTANCES: IActionInstance[] = [
  {
    instanceId: "instance-id-1",
    activatedActionId: "activation-id-1",
    integrationKey: "smtp",
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
    activatedActionId: "activation-id-1",
    integrationKey: "smtp",
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    triggerLogic: "some-test-trigger-logic-2",
    formAction: "delete",
    configuration: {
      foo1: "bar1",
    },
  },
  {
    instanceId: "instance-id-3",
    activatedActionId: "activation-id-1",
    integrationKey: "smtp",
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    triggerLogic: "some-test-trigger-logic-3",
    formAction: "update",
    configuration: {
      foo2: "bar2",
    },
  },
  {
    instanceId: "instance-id-4",
    activatedActionId: HTTP_ACTIVATION_ID,
    integrationKey: "http",
    entity: "secondary-model",
    implementationKey: "POST",
    triggerLogic: "another-trigger-logic",
    formAction: "delete",
    configuration: {
      bar: "foo",
    },
  },
];

describe("/api/actions/instances/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated_actions"]);
    await setupActionInstanceTestData(TEST_ACTION_INSTANCES);
  });

  it("should show entity action instances", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "base-model",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "activatedActionId": "activation-id-1",
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "formAction": "create",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-1",
          "integrationKey": "smtp",
          "triggerLogic": "some-test-trigger-logic",
        },
        {
          "activatedActionId": "activation-id-1",
          "configuration": {
            "foo1": "bar1",
          },
          "entity": "base-model",
          "formAction": "delete",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-2",
          "integrationKey": "smtp",
          "triggerLogic": "some-test-trigger-logic-2",
        },
        {
          "activatedActionId": "activation-id-1",
          "configuration": {
            "foo2": "bar2",
          },
          "entity": "base-model",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-3",
          "integrationKey": "smtp",
          "triggerLogic": "some-test-trigger-logic-3",
        },
      ]
    `);
  });

  it("should delete action instances", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        key: "instance-id-3",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(204);

    const { req: getReq, res: getRes } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "base-model",
      },
    });
    await handler(getReq, getRes);

    expect(getRes._getStatusCode()).toBe(200);
    expect(getRes._getJSONData()).toHaveLength(2);
  });

  it("should patch action instances", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        key: "instance-id-2",
      },
      body: {
        activatedActionId: "activation-id-2-updated",
        integrationKey: "slack",
        entity: "base-model",
        implementationKey: "SEND_MESSAGE_UPDATED",
        triggerLogic: "updated-trigger-logic",
        formAction: "update",
        configuration: {
          you: "are",
          awe: "some",
        },
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const { req: getReq, res: getRes } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "base-model",
      },
    });
    await handler(getReq, getRes);

    expect(getRes._getStatusCode()).toBe(200);
    expect(getRes._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "activatedActionId": "activation-id-1",
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "formAction": "create",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-1",
          "integrationKey": "smtp",
          "triggerLogic": "some-test-trigger-logic",
        },
        {
          "activatedActionId": "activation-id-2-updated",
          "configuration": {
            "awe": "some",
            "you": "are",
          },
          "entity": "base-model",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE_UPDATED",
          "instanceId": "instance-id-2",
          "integrationKey": "slack",
          "triggerLogic": "updated-trigger-logic",
        },
      ]
    `);
  });
});
