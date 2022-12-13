import { POST_MARK_ACTION_INTEGRATION } from "..";

describe("POST_MARK_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await POST_MARK_ACTION_INTEGRATION.connect({
        serverToken: "some-server-token",
        defaultSenderEmail: "some-default-sender-address",
      })
    ).toMatchInlineSnapshot(`
      {
        "defaultSenderEmail": "some-default-sender-address",
        "serverToken": "some-server-token",
      }
    `);
  });
});
