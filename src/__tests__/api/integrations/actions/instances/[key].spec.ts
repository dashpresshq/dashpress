import handler from "pages/api/integrations/actions/instances/[key]";
import { ActionIntegrationKeys, IActionInstance } from "shared/types/actions";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupActionInstanceTestData } from "__tests__/api/_test-utils/_action-instances";
import { DataEventActions } from "shared/types/data";

const TEST_ACTION_INSTANCES: IActionInstance[] = [
  {
    instanceId: "instance-id-1",
    integrationKey: ActionIntegrationKeys.SMTP,
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    formAction: DataEventActions.Create,
    configuration: {
      foo: "bar",
    },
  },
  {
    instanceId: "instance-id-2",
    integrationKey: ActionIntegrationKeys.SMTP,
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    formAction: DataEventActions.Delete,
    configuration: {
      foo1: "bar1",
    },
  },
  {
    instanceId: "instance-id-3",
    integrationKey: ActionIntegrationKeys.SMTP,
    entity: "base-model",
    implementationKey: "SEND_MESSAGE",
    formAction: DataEventActions.Update,
    configuration: {
      foo2: "bar2",
    },
  },
  {
    instanceId: "instance-id-4",
    integrationKey: ActionIntegrationKeys.HTTP,
    entity: "secondary-model",
    implementationKey: "POST",
    formAction: DataEventActions.Delete,
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
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "formAction": "create",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-1",
          "integrationKey": "smtp",
        },
        {
          "configuration": {
            "foo1": "bar1",
          },
          "entity": "base-model",
          "formAction": "delete",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-2",
          "integrationKey": "smtp",
        },
        {
          "configuration": {
            "foo2": "bar2",
          },
          "entity": "base-model",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-3",
          "integrationKey": "smtp",
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
        integrationKey: "slack",
        entity: "base-model",
        implementationKey: "SEND_MESSAGE_UPDATED",
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
          "configuration": {
            "foo": "bar",
          },
          "entity": "base-model",
          "formAction": "create",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "instance-id-1",
          "integrationKey": "smtp",
        },
        {
          "configuration": {
            "awe": "some",
            "you": "are",
          },
          "entity": "base-model",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE_UPDATED",
          "instanceId": "instance-id-2",
          "integrationKey": "slack",
        },
      ]
    `);
  });
});
