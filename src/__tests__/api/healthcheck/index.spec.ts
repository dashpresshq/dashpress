import { createMocks } from "node-mocks-http";
import handler from "pages/api/healthcheck";

describe("/api/healthcheck", () => {
  it("should set up app successfuly", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ ok: true });
  });
});
