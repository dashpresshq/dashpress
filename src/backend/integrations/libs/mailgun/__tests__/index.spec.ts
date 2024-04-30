import { MAIL_GUN_ACTION_INTEGRATION } from "..";

describe("MAIL_GUN_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await MAIL_GUN_ACTION_INTEGRATION.connect({
        apiKey: "some-apikey",
        domain: "some-domain",
      })
    ).toMatchInlineSnapshot(`
      {
        "apiKey": "some-apikey",
        "domain": "some-domain",
      }
    `);
  });
});
