import handler from "pages/api/roles/index";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/roles/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["roles"]);
  });

  it("should list all roles", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "label": "Some Admin Permissions",
          "value": "some-admin-permissions",
        },
        {
          "label": "View All Data Only",
          "value": "view-all-data-only",
        },
        {
          "label": "Creator",
          "value": "creator",
        },
        {
          "label": "Viewer",
          "value": "viewer",
        },
      ]
    `);
  });

  it("should create new role", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "POST",
      body: {
        name: "New Role",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(201);

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toHaveLength(5);
    expect(res._getJSONData()[2]).toMatchInlineSnapshot(`
      {
        "label": "New Role",
        "value": "new-role",
      }
    `);
  });
});
