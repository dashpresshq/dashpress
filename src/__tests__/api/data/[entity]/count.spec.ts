import handler from "pages/api/data/[entity]/count";
import {
  setupAllTestData,
  setupTestDatabaseData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

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

  it.skip("should count filtered data correctly", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        query: {
          "filters%5B0%5D%%5Bid%5D%": "id",
          "filters%5B0%5D%%5Bvalue%5D%%5Boperator%5D%": "e",
          "filters%5B0%5D%%5Bvalue%5D%%5Bvalue%5D%": 1,
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      count: 1,
    });
  });
});
