import handler from "pages/api/entities/[entity]/relations";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";
import { setupAppConfigTestData } from "__tests__/setup-test-data/_app-config";

describe("/api/entities/[entity]/relations", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should get entity relation", async () => {
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
});
