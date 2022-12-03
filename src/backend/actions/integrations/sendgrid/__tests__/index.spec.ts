import { SEND_GRID_ACTION_INTEGRATION } from "..";

describe("SEND_GRID_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await SEND_GRID_ACTION_INTEGRATION.connect({
        apiKey: "some-apikey",
        defaultSenderName: "some-default-sender-name",
        defaultSenderEmail: "some-default-sender-address",
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
