import { checkNodeVersion } from "../../checkNodeVersion";

jest.mock("process", () => ({ versions: { node: "16.9.9" } }));

describe("checkNodeVersion", () => {
  it("should show correct message for deprecated version", async () => {
    expect(checkNodeVersion()).toMatchInlineSnapshot(`
      {
        "message": "16.9.9",
        "status": true,
      }
    `);
  });
});
