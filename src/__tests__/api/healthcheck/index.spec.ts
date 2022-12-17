import handler from "pages/api/healthcheck";
import { createUnAuthenticatedMocks } from "../_test-utils/_authenticatedMock";

describe("/api/healthcheck", () => {
  it("should set up app successfuly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: true });
  });
});
