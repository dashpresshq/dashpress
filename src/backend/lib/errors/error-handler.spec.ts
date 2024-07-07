import { createUnAuthenticatedMocks } from "@/tests/api/setups/_authenticatedMock";

import { requestHandler } from "../request";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from ".";

describe("/api/error/handling", () => {
  it("should transform BadRequestError correctly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          throw new BadRequestError("Name is required", { name: "Required" });
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Name is required",
        "method": "GET",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
        "validations": {
          "name": "Required",
        },
      }
    `);
  });

  it("should transform NotFoundError correctly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          throw new NotFoundError("User not found");
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "User not found",
        "method": "GET",
        "name": "NotFoundError",
        "path": "",
        "statusCode": 404,
      }
    `);
  });

  it("should transform UnauthorizedError correctly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          throw new UnauthorizedError("Invalid Login");
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "",
        "message": "Invalid Login",
        "method": "GET",
        "name": "UnauthorizedError",
        "path": "",
        "statusCode": 401,
      }
    `);
  });

  it("should transform ForbiddenError correctly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          throw new ForbiddenError(
            "Access to resource is denied",
            "DEMO_ERROR_CODE"
          );
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "errorCode": "DEMO_ERROR_CODE",
        "message": "Access to resource is denied",
        "method": "GET",
        "name": "ForbiddenError",
        "path": "",
        "statusCode": 403,
      }
    `);
  });

  it("should transform plain Error correctly", async () => {
    const { req, res } = createUnAuthenticatedMocks({
      method: "GET",
    });

    await requestHandler(
      {
        GET: async () => {
          throw new Error("Something went wrong");
        },
      },
      [
        {
          _type: "guest",
        },
      ]
    )(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Something went wrong",
        "method": "GET",
        "path": "",
        "statusCode": 500,
      }
    `);
  });
});
