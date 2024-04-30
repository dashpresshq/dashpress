import { SEND_GRID_ACTION_INTEGRATION } from "..";

describe("SEND_GRID_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    expect(
      await SEND_GRID_ACTION_INTEGRATION.connect({
        apiKey: "some-apikey",
      })
    ).toMatchInlineSnapshot(`
      {
        "apiKey": "some-apikey",
      }
    `);
  });
});
