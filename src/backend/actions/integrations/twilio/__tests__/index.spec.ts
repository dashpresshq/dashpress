import { TWILIO_ACTION_INTEGRATION } from "..";

describe("TWILIO_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await TWILIO_ACTION_INTEGRATION.connect({
        authToken: "some-auth-token",
        accountSid: "some-account-SID",
      })
    ).toMatchInlineSnapshot(`
      {
        "accountSid": "some-account-SID",
        "authToken": "some-auth-token",
      }
    `);
  });
});
