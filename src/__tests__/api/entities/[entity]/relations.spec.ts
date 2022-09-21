import handler from "pages/api/entities/[entity]/relations";
import {
  setupAppConfigTestData,
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/entities/[entity]/relations", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should get entity relations", async () => {
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
      [
        {
          "field": "addressedById",
          "table": "users",
          "type": "toOne",
        },
        {
          "field": "typeId",
          "table": "friends",
          "type": "toOne",
        },
        {
          "table": "profile",
          "type": "toMany",
        },
        {
          "table": "disabled-entity-1",
          "type": "toMany",
        },
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

    expect(res._getJSONData()).toHaveLength(3);
  });

  it("should hide hidden entity relations", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
      "hidden_entity_relations__base-model": ["users", "friends"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toHaveLength(1);
  });

  it("should order entity relations when order is set", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
      "entity_relations_order__base-model": ["profile", "users", "friends"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData().map(({ table }) => table)).toEqual([
      "profile",
      "users",
      "friends",
    ]);
  });

  it("should label the relations when present", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
      "entity_relations_labels__base-model": {
        profile: "Labelled Profile",
        users: "Renamed Users",
      },
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "field": "addressedById",
          "label": "Renamed Users",
          "table": "users",
          "type": "toOne",
        },
        {
          "field": "typeId",
          "table": "friends",
          "type": "toOne",
        },
        {
          "label": "Labelled Profile",
          "table": "profile",
          "type": "toMany",
        },
      ]
    `);
  });
});
