import handler from "@/pages/api/menu";
import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "@/tests/api/setups";

describe("/api/menu", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should render the menu with non disabled menus", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "icon": "Home",
          "link": "home",
          "title": "Home",
          "type": "system",
        },
        {
          "icon": "File",
          "link": "app-navigation",
          "title": "App Navigation",
          "type": "header",
        },
        {
          "icon": "File",
          "link": "base-model",
          "title": "Base Model Plural",
          "type": "entities",
        },
        {
          "icon": "File",
          "link": "secondary-model",
          "title": "Secondary Model",
          "type": "entities",
        },
        {
          "icon": "File",
          "link": "tests",
          "title": "Tests",
          "type": "entities",
        },
        {
          "icon": "Users",
          "link": "accounts",
          "title": "Accounts",
          "type": "header",
        },
        {
          "icon": "Users",
          "link": "users",
          "title": "Users",
          "type": "system",
        },
        {
          "icon": "Shield",
          "link": "roles",
          "title": "Roles",
          "type": "system",
        },
        {
          "icon": "Users",
          "link": "configurations",
          "title": "Configurations",
          "type": "header",
        },
        {
          "icon": "Settings",
          "link": "settings",
          "title": "App Settings",
          "type": "system",
        },
        {
          "icon": "Zap",
          "link": "integrations",
          "title": "Integrations",
          "type": "system",
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
          "icon": "Home",
          "link": "home",
          "title": "Home",
          "type": "system",
        },
        {
          "icon": "File",
          "link": "app-navigation",
          "title": "App Navigation",
          "type": "header",
        },
        {
          "icon": "File",
          "link": "secondary-model",
          "title": "Secondary Model",
          "type": "entities",
        },
        {
          "icon": "File",
          "link": "base-model",
          "title": "Base Model Plural",
          "type": "entities",
        },
        {
          "icon": "Users",
          "link": "accounts",
          "title": "Accounts",
          "type": "header",
        },
        {
          "icon": "Users",
          "link": "users",
          "title": "Users",
          "type": "system",
        },
        {
          "icon": "Shield",
          "link": "roles",
          "title": "Roles",
          "type": "system",
        },
        {
          "icon": "Users",
          "link": "configurations",
          "title": "Configurations",
          "type": "header",
        },
        {
          "icon": "Settings",
          "link": "settings",
          "title": "App Settings",
          "type": "system",
        },
        {
          "icon": "Zap",
          "link": "integrations",
          "title": "Integrations",
          "type": "system",
        },
      ]
    `);
  });
});

// TEST: test isMenuItemAllowed
