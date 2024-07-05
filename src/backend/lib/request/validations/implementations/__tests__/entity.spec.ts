import { requestHandler } from "backend/lib/request";
import { UserPermissions } from "shared/constants/user";
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

const handlerWithOptionsTrue = requestHandler({
  GET: async (getValidatedRequest) => {
    const validatedRequest = await getValidatedRequest([
      {
        _type: "entity",
        options: true,
      },
    ]);
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

  it("should allow users access the disabled entity when options is true", async () => {
    const { req, res } = createAuthenticatedCustomRoleMocks({
      method: "GET",
      query: {
        entity: "disabled-entity-1",
      },
    });

    await handlerWithOptionsTrue(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "disabled-entity-1",
      }
    `);
  });

  it("should not allow users access the disabled entity when options is not true", async () => {
    await setupRolesTestData([
      {
        id: "custom-role",
        permissions: [UserPermissions.CAN_MANAGE_DASHBOARD],
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
