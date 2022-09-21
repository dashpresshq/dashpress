import handler from "pages/api/entities/list";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

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
      [
        {
          "label": "base-model",
          "value": "base-model",
        },
        {
          "label": "disabled-entity-1",
          "value": "disabled-entity-1",
        },
        {
          "label": "disabled-entity-2",
          "value": "disabled-entity-2",
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
