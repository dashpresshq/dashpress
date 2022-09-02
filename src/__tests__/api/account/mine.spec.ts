import handler from "pages/api/account/mine";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/account/mine", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should get authenticated user profile", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "name": "Root User",
        "permissions": Array [],
        "role": "creator",
        "systemProfile": "{\\"userId\\": \\"1\\"}",
        "username": "root",
      }
    `);
  });

  it("should update authenticated user profile", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        name: "Updated Name",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "name": "Updated Name",
        "permissions": Array [],
        "role": "creator",
        "systemProfile": "{\\"userId\\": \\"1\\"}",
        "username": "root",
      }
    `);
  });
});
