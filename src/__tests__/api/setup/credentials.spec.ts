import handler from "@/pages/api/setup/credentials";
import { setupCredentialsTestData } from "@/tests/api/setups";
import { createUnAuthenticatedMocks } from "@/tests/api/setups/_authenticatedMock";

describe("/api/setup/credentials", () => {
  beforeAll(async () => {
    await setupCredentialsTestData(false);
  });

  it("should throw error when saving invalid credentials", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        dataSourceType: "postgres",
        host: "some invalid host",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Couldn't not connect to database 'Knex: run
      $ npm install pg --save
      TextEncoder is not defined'",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should save valid credentials", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        dataSourceType: "sqlite",
        connectionString: "sqlite:./test.sqlite",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should throw error when db credentials already exist", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "POST",
      body: {
        dataSourceType: "sqlite",
        connectionString: "sqlite:./test.sqlite",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Primary database credentials already configured",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });
});
