import { createMocks } from "node-mocks-http";
import handler from "../../pages/api/enums/[name]";

describe("/api/enums/[name]", () => {
  it("should return enums by name", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        name: "contactUs_state_enum",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        "un-addressed",
        "addressed",
        "closed",
      ]
    `);
  });
});
