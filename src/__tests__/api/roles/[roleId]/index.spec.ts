import permissionsHandler from "pages/api/roles/[roleId]/permissions";
import handler from "pages/api/roles/[roleId]/index";
import rolesIndexhandler from "pages/api/roles/index";
import accountDetailsHandler from "pages/api/account/[username]/index";
import {
  setupUsersTestData,
  setupRolesTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/roles/[roleId]/index", () => {
  beforeAll(async () => {
    await setupUsersTestData([
      {
        username: "role-to-update__user",
        password: "foo",
        name: "User 1",
        role: "role-to-update",
      },
      {
        username: "role-to-delete__user",
        password: "foo",
        name: "User 2",
        role: "role-to-delete",
      },
    ]);
    await setupRolesTestData([
      {
        id: "role-to-update",
        permissions: [],
      },
      {
        id: "foo-role",
        permissions: [],
      },
      {
        id: "role-to-delete",
        permissions: [],
      },
    ]);
  });

  it("should delete role and reset to users to `viewer`", async () => {
    const deleteRequest = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        roleId: "role-to-delete",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(204);

    // Assert that role has been deleted
    const rolesIndexRequest = createAuthenticatedMocks({
      method: "GET",
    });

    await rolesIndexhandler(rolesIndexRequest.req, rolesIndexRequest.res);

    expect(rolesIndexRequest.res._getJSONData()).toHaveLength(4);

    // Assert that user roles has been synced to `viewer`
    const accountDetailsRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "role-to-delete__user",
      },
    });

    await accountDetailsHandler(
      accountDetailsRequest.req,
      accountDetailsRequest.res
    );

    expect(accountDetailsRequest.res._getJSONData().role).toBe("viewer");
  });

  it("should update role details and propagate new role to users", async () => {
    const patchRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        roleId: "role-to-update",
      },
      body: {
        name: "Update Role",
      },
    });

    await handler(patchRequest.req, patchRequest.res);

    expect(patchRequest.res._getStatusCode()).toBe(200);

    // Assert that role changed on list level
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await rolesIndexhandler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "Foo Role",
          "value": "foo-role",
        },
        {
          "label": "Update Role",
          "value": "update-role",
        },
        {
          "label": "Super Admin",
          "value": "creator",
        },
        {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);

    // Assert that role changed on id level
    const permissionsRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "update-role",
      },
    });

    await permissionsHandler(permissionsRequest.req, permissionsRequest.res);

    expect(permissionsRequest.res._getStatusCode()).toBe(200);
    expect(permissionsRequest.res._getJSONData()).toEqual([]);

    // Assert that old role doesn't exist on id level
    const permissionsRequest$2 = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "role-to-update",
      },
    });

    await permissionsHandler(
      permissionsRequest$2.req,
      permissionsRequest$2.res
    );

    expect(permissionsRequest$2.res._getStatusCode()).toBe(404);

    // Assert that role propagates to users
    const accountDetailsRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        username: "role-to-update__user",
      },
    });

    await accountDetailsHandler(
      accountDetailsRequest.req,
      accountDetailsRequest.res
    );

    expect(accountDetailsRequest.res._getJSONData().role).toBe("update-role");
  });

  it("should not update role to system role", async () => {
    const patchRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        roleId: "update-role",
      },
      body: {
        name: "Viewer",
      },
    });

    await handler(patchRequest.req, patchRequest.res);

    expect(patchRequest.res._getStatusCode()).toBe(400);
    expect(patchRequest.res._getJSONData()).toEqual({
      message: "Role already exist",
      method: "PATCH",
      name: "BadRequestError",
      path: "",
      statusCode: 400,
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await rolesIndexhandler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "Foo Role",
          "value": "foo-role",
        },
        {
          "label": "Update Role",
          "value": "update-role",
        },
        {
          "label": "Super Admin",
          "value": "creator",
        },
        {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);
  });

  it("should not update role to existing role", async () => {
    const patchRequest = createAuthenticatedMocks({
      method: "PATCH",
      query: {
        roleId: "foo-role",
      },
      body: {
        name: "Update Role",
      },
    });

    await handler(patchRequest.req, patchRequest.res);

    expect(patchRequest.res._getStatusCode()).toBe(400);
    expect(patchRequest.res._getJSONData()).toEqual({
      message: "Role already exist",
      method: "PATCH",
      name: "BadRequestError",
      path: "",
      statusCode: 400,
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await rolesIndexhandler(req, res);

    expect(res._getJSONData()).toHaveLength(4);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "Foo Role",
          "value": "foo-role",
        },
        {
          "label": "Update Role",
          "value": "update-role",
        },
        {
          "label": "Super Admin",
          "value": "creator",
        },
        {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);
  });
});
