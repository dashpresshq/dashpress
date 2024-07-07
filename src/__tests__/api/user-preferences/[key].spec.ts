import handler from "@/pages/api/user-preferences/[key]";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

describe.skip("/api/user-preferences/[key]", () => {
  beforeAll(async () => {
    await setupAllTestData(["users-preferences"]);
  });

  it("should get the default value when value doesn't exist for user", async () => {
    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "theme",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "light",
      }
    `);
  });

  it("should create authenticated user preference when doesn't exist", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "theme",
      },
      body: {
        data: "dark",
      },
    });

    await handler(postRequest.req, postRequest.res);

    expect(postRequest.res._getStatusCode()).toBe(204);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "theme",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "dark",
      }
    `);
  });

  it("should update authenticated user preference it when exists", async () => {
    const postRequest = createAuthenticatedMocks({
      method: "PUT",
      query: {
        key: "theme",
      },
      body: {
        data: "light",
      },
    });

    await handler(postRequest.req, postRequest.res);

    const getRequest = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "theme",
      },
    });

    await handler(getRequest.req, getRequest.res);

    expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "data": "light",
      }
    `);
  });

  describe("Preference key validation", () => {
    it("GET", async () => {
      const getRequest = createAuthenticatedMocks({
        method: "GET",
        query: {
          key: "some-invalid-preference-key",
        },
      });

      await handler(getRequest.req, getRequest.res);

      expect(getRequest.res._getStatusCode()).toBe(400);

      expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "User Preference key 'some-invalid-preference-key' doesn't exist",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
    });

    it("PUT", async () => {
      const getRequest = createAuthenticatedMocks({
        query: {
          key: "some-invalid-preference-key",
        },
        method: "PUT",
        body: {
          data: "light",
        },
      });

      await handler(getRequest.req, getRequest.res);

      expect(getRequest.res._getStatusCode()).toBe(400);

      expect(getRequest.res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "User Preference key 'some-invalid-preference-key' doesn't exist",
        "method": "PUT",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
    });
  });
});
