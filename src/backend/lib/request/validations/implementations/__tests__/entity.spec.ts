import { requestHandler } from "backend/lib/request";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  createAuthenticatedCustomRoleMocks,
  createAuthenticatedMocks,
  setupAllTestData,
  setupRolesTestData,
} from "__tests__/api/_test-utils";

const handler = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest(["entity"]);
    return { data: validatedRequest.entity };
  },
});

describe("Request Validations => entityValidationImpl", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "users", "app-config"]);
  });
  it("should return back valid entity", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "tests",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "tests",
      }
    `);
  });

  it("should return 404 for non-existent entities", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "non-existent-entity",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "This resource doesn't exist or is disabled or you dont have access to it",
        "method": "GET",
        "name": "NotFoundError",
        "path": "",
        "statusCode": 404,
      }
    `);
  });

  it("should allow users who can `CAN_CONFIGURE_APP` view the disabled entity", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: [USER_PERMISSIONS.CAN_CONFIGURE_APP],
      },
    ]);
    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "GET",
      query: {
        entity: "disabled-entity-1",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "disabled-entity-1",
      }
    `);
  });

  it("should not allow users without `CAN_CONFIGURE_APP` view disabled entities", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: [USER_PERMISSIONS.CAN_MANAGE_DASHBOARD],
      },
    ]);
    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "GET",
      query: {
        entity: "disabled-entity-1",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "This resource doesn't exist or is disabled or you dont have access to it",
        "method": "GET",
        "name": "NotFoundError",
        "path": "",
        "statusCode": 404,
      }
    `);
  });
});
