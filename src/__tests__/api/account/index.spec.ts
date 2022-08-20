import { setupAllTestData } from "__tests__/setup-test-data";
import handler from "pages/api/account/index";
import { createAuthenticatedMocks } from "__tests__/helpers";

describe("/api/account/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
  });

  it("should list users", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "Root User",
          "role": "creator",
          "username": "root",
        },
      ]
    `);
  });

  it("should create new user", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        username: "newuser",
        name: "New user",
        role: "viewer",
        password: "password",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toHaveLength(2);

    expect(getRequest.res._getJSONData()[1]).toMatchInlineSnapshot(`
      Object {
        "name": "New user",
        "role": "viewer",
        "username": "newuser",
      }
    `);
  });
});
