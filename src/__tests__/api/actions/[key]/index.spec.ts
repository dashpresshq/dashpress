import handler from "pages/api/actions/[key]/index";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/actions/[key]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["action_instances"]);
  });

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
          "activatedActionId": "DEFAULT",
          "configuration": {
            "bar": "foo",
          },
          "entity": "secondary-model",
          "formAction": "delete",
          "implementationKey": "POST",
          "instanceId": "instance-id-2",
          "integrationKey": "http",
          "triggerLogic": "another-trigger-logic",
        },
      ]
    `);
  });
});
