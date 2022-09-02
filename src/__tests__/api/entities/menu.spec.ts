import handler from "pages/api/entities/menu";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";
import { setupAppConfigTestData } from "__tests__/setup-test-data/_app-config";

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
      Array [
        Object {
          "label": "base-model",
          "value": "base-model",
        },
        Object {
          "label": "secondary-model",
          "value": "secondary-model",
        },
        Object {
          "label": "tests",
          "value": "tests",
        },
      ]
    `);
  });

  it("should order entities when provided", async () => {
    await setupAppConfigTestData({
      disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
      entities_order: ["secondary-model", "base-model"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "secondary-model",
          "value": "secondary-model",
        },
        Object {
          "label": "base-model",
          "value": "base-model",
        },
        Object {
          "label": "tests",
          "value": "tests",
        },
      ]
    `);
  });
});
