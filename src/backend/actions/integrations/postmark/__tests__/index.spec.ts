import { POST_MARK_ACTION_INTEGRATION } from "..";

describe("POST_MARK_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await POST_MARK_ACTION_INTEGRATION.connect({
        serverToken: "some-server-token",
      })
    ).toMatchInlineSnapshot(`
      {
        "serverToken": "some-server-token",
      }
    `);
  });
});
