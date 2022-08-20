import handler from "pages/api/account/[username]/index";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupUsersTestData } from "__tests__/setup-test-data/_users";

describe("/account/[username]/index", () => {
  beforeAll(async () => {
    await setupUsersTestData([
      {
        username: "testuser1",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Test User 1",
        role: "creator",
        systemProfile: '{"userId": "1"}',
      },
      {
        username: "testuser2",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Test User 2",
        role: "viewer",
        systemProfile: '{"userId": "2"}',
      },
    ]);
  });

  it("should get user details", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "testuser1",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "name": "Test User 1",
        "role": "creator",
        "systemProfile": "{\\"userId\\": \\"1\\"}",
        "username": "testuser1",
      }
    `);
  });

  it("should delete user", async () => {
    const deleteRequest = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        username: "testuser1",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(204);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "testuser1",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getStatusCode()).toBe(404);
  });

  it("should update user", async () => {
    const updateRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        username: "testuser2",
      },
      body: {
        name: "Test Name Updated",
        role: "creator",
        systemProfile: '{"updatedUserId": "2"}',
      },
    });

    await handler(updateRequest.req, updateRequest.res);

    expect(updateRequest.res._getStatusCode()).toBe(200);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "testuser2",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "name": "Test Name Updated",
        "role": "creator",
        "systemProfile": "{\\"updatedUserId\\": \\"2\\"}",
        "username": "testuser2",
      }
    `);
  });
});
