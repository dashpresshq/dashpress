import handler from "pages/api/integrations/actions/active";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/integrations/actions/active", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated_actions"]);
  });

  it("should show all activated actions in addition with HTTP", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
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
});
