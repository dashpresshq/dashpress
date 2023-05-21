import { checkNodeVersion } from "../../checkNodeVersion";

jest.mock("process", () => ({ versions: { node: "1.9.9" } }));

describe("checkNodeVersion", () => {
  it("should show correct message for deprecated version", async () => {
    expect(checkNodeVersion()).toMatchInlineSnapshot(`
      {
        "message": "Your node version 1.9.9 is not officially supported. Kindly upgrade to version <=16 before reporting any issues.",
        "status": false,
      }
    `);
  });
});
