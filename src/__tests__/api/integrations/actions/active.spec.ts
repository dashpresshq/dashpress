import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/integrations/actions/active";

describe("/api/integrations/actions/active", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-integrations"]);
  });

  it("should show all activated actions in addition with HTTP", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        "smtp",
        "slack",
        "http",
      ]
    `);
  });
});
