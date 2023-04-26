import handler from "pages/api/entities/active";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/entities/menu", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should list all entities not disabled", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "base-model",
          "value": "base-model",
        },
        {
          "label": "secondary-model",
          "value": "secondary-model",
        },
        {
          "label": "tests",
          "value": "tests",
        },
      ]
    `);
  });
});
