import handler from "pages/api/entities/list";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";

describe("/api/entities/list", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema"]);
  });

  it("should list all entities", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "base-model",
          "value": "base-model",
        },
        Object {
          "label": "disabled-entity-1",
          "value": "disabled-entity-1",
        },
        Object {
          "label": "disabled-entity-2",
          "value": "disabled-entity-2",
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
});
