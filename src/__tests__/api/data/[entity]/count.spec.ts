import handler from "pages/api/data/[entity]/count";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";
import { setupTestDatabaseData } from "__tests__/setup-test-data/_data";

describe("/api/data/[entity]/count", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config"]);
    await setupTestDatabaseData();
  });

  it("should count data correctly", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      count: 2,
    });
  });
});
