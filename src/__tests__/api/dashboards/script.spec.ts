import handler from "pages/api/dashboards/script";
import {
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

describe("/api/dashboards/script", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeAll(async () => {
    await setupAllTestData(["dashboard-widgets", "data", "credentials"]);
  });

  it("should return data from posted script", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: `return await $.query("SELECT * FROM tests WHERE status = 'closed'")`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "age": 5,
          "createdAt": 1660735797330,
          "id": 1,
          "name": "John Doe",
          "referenceId": 3,
          "status": "closed",
          "verified": 1,
        },
      ]
    `);
  });

  it("should return structured error on invalid script", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: `return await $.INVALID("SELECT * FROM tests WHERE status = 'closed'")`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "context": {
          "currentUser": {
            "name": "Root User",
            "role": "creator",
            "username": "root",
          },
        },
        "error": {},
        "expression": "return await $.INVALID("SELECT * FROM tests WHERE status = 'closed'")",
        "message": "$.INVALID is not a function",
      }
    `);
  });

  it("should return structured error on invalid query", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: `return await $.query("INVALID * FROM tests WHERE status = 'closed'")`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "context": {
          "currentUser": {
            "name": "Root User",
            "role": "creator",
            "username": "root",
          },
        },
        "error": {
          "code": "SQLITE_ERROR",
        },
        "expression": "return await $.query("INVALID * FROM tests WHERE status = 'closed'")",
        "message": "INVALID * FROM tests WHERE status = 'closed' - near "INVALID": syntax error",
      }
    `);
  });

  it("should return empty object when empty script is passed", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: ``,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`"{}"`);
  });

  it("should render script params correctly", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-02-02"));

    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: `return {"currentUser": $.currentUser, "now": "$.RELATIVE_TIME"}`,
        relativeDate: "1:m",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "currentUser": {
          "name": "Root User",
          "role": "creator",
          "username": "root",
        },
        "now": "2022-01-02T00:00:00.000Z",
      }
    `);
  });

  it("should not run query on demo account", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        script: `return await $.query("SELECT * FROM tests WHERE status = 'closed'")`,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
          {
            "message": "This service is not available on the demo site",
            "method": "POST",
            "name": "BadRequestError",
            "path": "",
            "statusCode": 400,
          }
      `);
  });

  it("should return data from query script", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        widgetId: "widget-1",
        relativeDate: "111",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "age": 9,
          "createdAt": 1631878197330,
          "id": 2,
          "name": "Jane Doe",
          "referenceId": 5,
          "status": "opened",
          "verified": 0,
        },
      ]
    `);
  });
});
