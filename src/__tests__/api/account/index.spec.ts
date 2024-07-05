import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/account/index";

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
      [
        {
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
      {
        "name": "New user",
        "role": "viewer",
        "username": "newuser",
      }
    `);
  });

  it("should not re-create existing username", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        username: "newuser",
        name: "New user should not exist",
        role: "viewer should not exist",
        password: "password should not exist",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(400);

    expect(postRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Username already exists",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toHaveLength(2);

    expect(getRequest.res._getJSONData()[1]).toMatchInlineSnapshot(`
      {
        "name": "New user",
        "role": "viewer",
        "username": "newuser",
      }
    `);
  });
});
