import { SENDINBLUE_ACTION_INTEGRATION } from "..";

describe("SENDINBLUE_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await SENDINBLUE_ACTION_INTEGRATION.connect({
        apiKey: "some-apikey",
        defaultSenderEmail: "some-default-sender-address",
        defaultSenderName: "some-default-sender-name",
      })
    ).toMatchInlineSnapshot(`
      {
        "apiKey": "some-apikey",
        "defaultSenderEmail": "some-default-sender-address",
        "defaultSenderName": "some-default-sender-name",
      }
    `);
  });
});
