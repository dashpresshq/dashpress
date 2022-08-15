import { createMocks } from "node-mocks-http";
import { requestHandler } from "../request";
import { BadRequestError, ForbiddenError, NotFoundError } from ".";

describe("/api/error/handling", () => {
  it("should transform BadRequestError correctly", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await requestHandler({
      GET: async () => {
        throw new BadRequestError("Name is required");
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Name is required",
        "name": "BadRequestError",
      }
    `);
  });

  it("should transform NotFoundError correctly", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await requestHandler({
      GET: async () => {
        throw new NotFoundError("User not found");
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "User not found",
        "name": "BadRequestError",
      }
    `);
  });

  it("should transform ForbiddenError correctly", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await requestHandler({
      GET: async () => {
        throw new ForbiddenError("Access to resource is denied");
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Access to resource is denied",
        "name": "ForbiddenError",
      }
    `);
  });

  it("should transform plain Error correctly", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await requestHandler({
      GET: async () => {
        throw new Error("Something went wrong");
      },
    })(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Object {
        "message": "Something went wrong",
      }
    `);
  });
});
