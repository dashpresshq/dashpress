import handler from "pages/api/setup/credentials";
import { createMocks } from "node-mocks-http";
import { setupCredentialsTestData } from "__tests__/api/_test-utils";

describe("/api/setup/credentials", () => {
  beforeAll(async () => {
    await setupCredentialsTestData(false);
  });

  it("should throw error when saving invalid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        databaseType: "postgres",
        host: "some invalid host",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Couldn't not connect to database 'getaddrinfo ENOTFOUND some invalid host'",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should save valid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        databaseType: "postgres",
        connectionString: "sqlite:./test.sqlite",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should throw error when db credentials already exist", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        databaseType: "postgres",
        connectionString: "sqlite:./test.sqlite",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Primary database credentials already configured",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
