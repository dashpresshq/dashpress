import handler from "pages/api/menu";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";

describe.skip("/api/menu", () => {
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

  it("should list all entities not disabled for app and menu and order them when provided", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
      disabled_menu_entities: ["tests"],
      menu_entities_order: ["secondary-model", "base-model"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "secondary-model",
          "value": "secondary-model",
        },
        {
          "label": "base-model",
          "value": "base-model",
        },
      ]
    `);
  });
});

// :test piService.filterPermitte
