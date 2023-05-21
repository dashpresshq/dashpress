import handler from "pages/api/versions";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

describe("/api/versions/index", () => {
  it("should show version", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot();
  });
});
