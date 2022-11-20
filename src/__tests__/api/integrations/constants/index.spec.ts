import handler from "pages/api/integrations/constants";
import {
  setupAllTestData,
  createAuthenticatedViewerMocks,
} from "__tests__/api/_test-utils";

describe("/api/integrations/constants", () => {
  beforeAll(async () => {
    await setupAllTestData(["constants"]);
  });

  it("should list constants for all users", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "key": "CONSTANT_KEY_1",
          "value": "CONSTANT_KEY_1",
        },
        {
          "key": "CONSTANT_KEY_2",
          "value": "CONSTANT_KEY_2",
        },
        {
          "key": "GROUP_CONSTANT___KEY_3",
          "value": "CONSTANT_KEY_3",
        },
        {
          "key": "GROUP_CONSTANT___KEY_4",
          "value": "CONSTANT_KEY_4",
        },
      ]
    `);
  });
});
