import handler from "pages/api/roles/[roleId]/index";
import rolesIndexhandler from "pages/api/roles/index";
import accountDetailsHandler from "pages/api/account/[username]/index";
import {
  setupUsersTestData,
  setupRolesTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/roles/[roleId]/index", () => {
  beforeEach(async () => {
    await setupUsersTestData([
      {
        username: "role-to-update__user",
        password: "foo",
        name: "User 1",
        role: "role-to-update",
        systemProfile: "",
      },
      {
        username: "role-to-delete__user",
        password: "foo",
        name: "User 2",
        role: "role-to-delete",
        systemProfile: "",
      },
    ]);
    await setupRolesTestData([
      {
        id: "role-to-update",
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

    expect(rolesIndexRequest.res._getJSONData()).toHaveLength(3);

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

    // Assert that role changed
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await rolesIndexhandler(req, res);

    expect(res._getJSONData()).toHaveLength(4);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "label": "Update Role",
          "value": "update-role",
        },
        Object {
          "label": "Role To Delete",
          "value": "role-to-delete",
        },
        Object {
          "label": "Creator",
          "value": "creator",
        },
        Object {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);

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
});
