import handler from "pages/api/roles/[roleId]/permissions";
import {
  setupRolesTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/roles/[roleId]/permissions", () => {
  beforeAll(async () => {
    await setupRolesTestData([
      {
        id: "some-admin-permissions",
        permissions: ["CAN_RESET_PASSWORD", "CAN_MANAGE_PERMISSIONS"],
      },
    ]);
  });

  it("should get role permissions", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "some-admin-permissions",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([
      "CAN_RESET_PASSWORD",
      "CAN_MANAGE_PERMISSIONS",
    ]);
  });

  it("should return empty for system permission", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "viewer",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  it("should remove permission from role", async () => {
    const deleteRequest = createAuthenticatedMocks({
      method: "DELETE",
      query: {
        roleId: "some-admin-permissions",
      },
      body: {
        permission: "CAN_RESET_PASSWORD",
      },
    });

    await handler(deleteRequest.req, deleteRequest.res);

    expect(deleteRequest.res._getStatusCode()).toBe(204);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "some-admin-permissions",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(["CAN_MANAGE_PERMISSIONS"]);
  });

  it("should add permission to role", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      query: {
        roleId: "some-admin-permissions",
      },
      body: {
        permission: "CAN_CONFIGURE_APP",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        roleId: "some-admin-permissions",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual([
      "CAN_MANAGE_PERMISSIONS",
      "CAN_CONFIGURE_APP",
    ]);
  });
});
