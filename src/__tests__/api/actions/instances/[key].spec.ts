import handler from "pages/api/actions/instances/[key]";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/actions/instances/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["action_instances"]);
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
      ]
    `);
  });
});
