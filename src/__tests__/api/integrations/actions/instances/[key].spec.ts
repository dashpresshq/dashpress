import handler from "pages/api/integrations/actions/instances/[key]";
import { ActionIntegrations, IActionInstance } from "shared/types/actions";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupActionInstanceTestData } from "__tests__/api/_test-utils/_action-instances";
import { DataEventActions } from "shared/types/data";

const TEST_ACTION_INSTANCES: IActionInstance[] = [
  {
    instanceId: "instance-id-1",
    integration: ActionIntegrations.SMTP,
    entity: "base-model",
    action: "SEND_MESSAGE",
    trigger: DataEventActions.Create,
    configuration: {
      foo: "bar",
    },
  },
  {
    instanceId: "instance-id-2",
    integration: ActionIntegrations.SMTP,
    entity: "base-model",
    action: "SEND_MESSAGE",
    trigger: DataEventActions.Delete,
    configuration: {
      foo1: "bar1",
    },
  },
  {
    instanceId: "instance-id-3",
    integration: ActionIntegrations.SMTP,
    entity: "base-model",
    action: "SEND_MESSAGE",
    trigger: DataEventActions.Update,
    configuration: {
      foo2: "bar2",
    },
  },
  {
    instanceId: "instance-id-4",
    integration: ActionIntegrations.HTTP,
    entity: "secondary-model",
    action: "POST",
    trigger: DataEventActions.Delete,
    configuration: {
      bar: "foo",
    },
  },
];

describe("/api/integrations/actions/instances/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-integrations"]);
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
          "action": "SEND_MESSAGE",
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "instanceId": "instance-id-1",
          "integration": "smtp",
          "trigger": "create",
        },
        {
          "action": "SEND_MESSAGE",
          "configuration": {
            "foo1": "bar1",
          },
          "entity": "base-model",
          "instanceId": "instance-id-2",
          "integration": "smtp",
          "trigger": "delete",
        },
        {
          "action": "SEND_MESSAGE",
          "configuration": {
            "foo2": "bar2",
          },
          "entity": "base-model",
          "instanceId": "instance-id-3",
          "integration": "smtp",
          "trigger": "update",
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
        integration: "slack",
        entity: "base-model",
        action: "SEND_MESSAGE_UPDATED",
        trigger: "update",
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
          "action": "SEND_MESSAGE",
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "instanceId": "instance-id-1",
          "integration": "smtp",
          "trigger": "create",
        },
        {
          "action": "SEND_MESSAGE_UPDATED",
          "configuration": {
            "awe": "some",
            "you": "are",
          },
          "entity": "base-model",
          "instanceId": "instance-id-2",
          "integration": "slack",
          "trigger": "update",
        },
      ]
    `);
  });
});
