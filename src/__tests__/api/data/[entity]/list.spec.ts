import handler from "@/pages/api/data/[entity]/list";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

describe("/api/data/[entity]/list", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "credentials", "app-config", "data"]);
  });

  describe("GET", () => {
    it("should list data", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              [
                {
                  "label": "John Doe",
                  "value": 1,
                },
                {
                  "label": "Jane Doe",
                  "value": 2,
                },
              ]
          `);
    });

    // SQLITE doesn't support ilike
    it.skip("should search list data", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "GET",
        query: {
          entity: "tests",
          search: "John",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
              Array [
                Object {
                  "label": "John Doe",
                  "value": 1,
                },
              ]
          `);
    });
  });
});

// Test entity validations implementation
