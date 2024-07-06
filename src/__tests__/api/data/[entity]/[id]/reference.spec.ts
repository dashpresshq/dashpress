import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupAppConfigTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/data/[entity]/[id]/reference";

describe("/api/data/[entity]/[id]/reference", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config", "data"]);
  });

  it("should show reference data with generated fields when config is empty", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        id: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toBe("John Doe");
  });

  it("should show reference data based on config", async () => {
    await setupAppConfigTestData({
      entity_relation_template__tests: {
        fields: ["name", "status"],
        format: "{{ name }} / {{ status }}",
      },
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        id: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toBe("John Doe / closed");
  });
});
