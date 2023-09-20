import { requestHandler } from "backend/lib/request";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  createAuthenticatedMocks,
  createAuthenticatedViewerMocks,
} from "__tests__/api/_test-utils";

const handler = requestHandler(
  {
    GET: async () => {
      return { foo: "bar" };
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
    },
  ]
);

describe("Request Validations => canUserValidationImpl", () => {
  it("should return data when user has requested permission", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "foo": "bar",
      }
    `);
  });

  it("should throw error when user doesn't have request permission", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Your account doesn't have enough priviledge to perform this action: (Can Manage Dashboard)",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 403,
      }
    `);
  });

  it("should return programming error when the persmission is not passed", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          return { foo: "bar" };
        },
      },
      [
        {
          _type: "canUser",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Please provide the required permission",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });

  it("should return programming error when an invalid permission is passed", async () => {
    const { req, res } = createAuthenticatedViewerMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          return { foo: "bar" };
        },
      },
      [
        {
          _type: "canUser",
          body: "some invalid permission",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "The provided permission seems to be invalid",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });
});
