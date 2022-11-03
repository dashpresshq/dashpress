import handler from "pages/api/account/preferences";
import mineHandler from "pages/api/account/mine";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

describe("/api/account/preferences", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should create authenticated user preference when doesn't exist", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        theme: "light",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await mineHandler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Root User",
        "permissions": [],
        "preferences": "{"theme":"light"}",
        "role": "creator",
        "systemProfile": "{"userId": "1"}",
        "username": "root",
      }
    `);
  });

  it("should update authenticated user preference it when exists", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PATCH",
      body: {
        theme: "dark",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(200);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await mineHandler(getRequest.req, getRequest.res);
    // Would be nice to test that it doesn't reset other fields data
    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Root User",
        "permissions": [],
        "preferences": "{"theme":"dark"}",
        "role": "creator",
        "systemProfile": "{"userId": "1"}",
        "username": "root",
      }
    `);
  });
});
