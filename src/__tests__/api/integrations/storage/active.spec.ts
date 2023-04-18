import handler from "pages/api/integrations/storage/active";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/integrations/storage/active", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-storage"]);
  });

  it("should show all activated storage", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        "s3",
        "google",
      ]
    `);
  });
});
