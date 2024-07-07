import handler from "@/pages/api/healthcheck";
import { setupAllTestData } from "@/tests/api/setups";
import { createUnAuthenticatedMocks } from "@/tests/api/setups/_authenticatedMock";

describe("/api/healthcheck", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
  });

  it("should set up app successfuly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: true });
  });
});
