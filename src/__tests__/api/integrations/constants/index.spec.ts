import handler from "pages/api/integrations/constants";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/integrations/constants", () => {
  beforeAll(async () => {
    await setupAllTestData(["constants"]);
  });

  it("should list constants for all users", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "CONSTANT_KEY_1": "CONSTANT_KEY_1",
        "CONSTANT_KEY_2": "CONSTANT_KEY_2",
        "GROUP____KEY_3": "CONSTANT_KEY_3",
        "GROUP____KEY_4": "CONSTANT_KEY_4",
      }
    `);
  });
});
