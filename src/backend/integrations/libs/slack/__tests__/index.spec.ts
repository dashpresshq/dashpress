import { SLACK_ACTION_INTEGRATION } from "..";

describe("SLACK_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await SLACK_ACTION_INTEGRATION.connect({
        token: "some-token",
      })
    ).toMatchInlineSnapshot(`
      {
        "token": "some-token",
      }
    `);
  });
});
