import handler from "@/pages/api/account/[username]/index";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedMocks,
  setupRolesTestData,
  setupUsersTestData,
} from "@/tests/api/setups";

describe("/account/[username]/index", () => {
  beforeAll(async () => {
    await setupUsersTestData([
      {
        username: "testuser1",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Test User 1",
        role: "creator",
      },
      {
        username: "root",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Root 1",
        role: "creator",
      },
      {
        username: "testuser2",
        password:
          "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
        name: "Test User 2",
        role: "viewer",
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
      {
        "name": "Test User 1",
        "role": "creator",
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

  it("should block deleting self user", async () => {
    const deleteRequest = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        username: "root",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(400);

    expect(deleteRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Can't delete your account",
        "method": "DELETE",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "root",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getStatusCode()).toBe(200);
    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Root 1",
        "role": "creator",
        "username": "root",
      }
    `);
  });

  it("should block deleting root user", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: ["CAN_MANAGE_USERS"],
      },
    ]);

    const deleteRequest = createAuthenticatedCustomRoleMocks({
      method: "DELETE",
      query: {
        username: "root",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(400);

    expect(deleteRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Can't delete root account",
        "method": "DELETE",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "root",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getStatusCode()).toBe(200);
    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "name": "Root 1",
        "role": "creator",
        "username": "root",
      }
    `);
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
      {
        "name": "Test Name Updated",
        "role": "creator",
        "username": "testuser2",
      }
    `);
  });
});
