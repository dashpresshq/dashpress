import handler from "pages/api/entities/[entity]/relation-list";
import {
  setupAppConfigTestData,
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/entities/[entity]/relation-list", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should list all entity relation", async () => {
    await setupAppConfigTestData({
      disabled_entities: [],
    });
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        "users",
        "friends",
        "profile",
        "disabled-entity-1",
      ]
    `);
  });

  it("should hide global disabled entities from list", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        "users",
        "friends",
        "profile",
      ]
    `);
  });
});
