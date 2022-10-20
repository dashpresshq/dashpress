import handler from "pages/api/integrations/credentials";
import {
  setupAllTestData,
  createAuthenticatedViewerMocks,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/integrations/credentials", () => {
  beforeAll(async () => {
    await setupAllTestData(["credentials"]);
  });

  it("should list redacted credentials for only priviledged users", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "CREDENTIAL_KEY_1": "XXXYYZ",
        "DATABASE___connectionString": "XXXYYZ",
        "DATABASE___dataSourceType": "XXXYYZ",
        "DATABASE___port": "XXXYYZ",
      }
    `);
  });

  it("should not return credentials for non priviledged users", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Your account doesn't have enough priviledge to perform this action",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });
});
