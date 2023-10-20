import handler from "pages/api/menu";
import {
  setupAllTestData,
  createAuthenticatedMocks,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";

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
          "children": [
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
          ],
          "icon": "File",
          "link": "home",
          "title": "Entities",
          "type": "system",
        },
        {
          "icon": "Zap",
          "link": "actions",
          "title": "Actions",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Settings",
          "link": "settings",
          "title": "Settings",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Users",
          "link": "users",
          "title": "Users",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Shield",
          "link": "roles",
          "title": "Roles",
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
          "children": [
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
          ],
          "icon": "File",
          "link": "home",
          "title": "Entities",
          "type": "system",
        },
        {
          "icon": "Zap",
          "link": "actions",
          "title": "Actions",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Settings",
          "link": "settings",
          "title": "Settings",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Users",
          "link": "users",
          "title": "Users",
          "type": "system",
        },
        {
          "children": [],
          "icon": "Shield",
          "link": "roles",
          "title": "Roles",
          "type": "system",
        },
      ]
    `);
  });
});

// TODO test isMenuItemAllowed
