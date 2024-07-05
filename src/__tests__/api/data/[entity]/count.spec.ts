import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/data/[entity]/count";

describe("/api/data/[entity]/count", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config", "data"]);
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

  it("should count filtered data correctly", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
        "filters[0][id]": "id",
        "filters[0][value][operator]": "e",
        "filters[0][value][value]": 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      count: 1,
    });
  });
});
