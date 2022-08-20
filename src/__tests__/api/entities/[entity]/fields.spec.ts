import handler from "pages/api/entities/[entity]/fields";
import { createAuthenticatedMocks } from "__tests__/helpers";
import { setupAllTestData } from "__tests__/setup-test-data";
import { setupAppConfigTestData } from "__tests__/setup-test-data/_app-config";

describe("/api/entities/[entity]/fields", () => {
  beforeAll(async () => {
    await setupAllTestData(["schema", "app-config"]);
  });

  it("should list all entity fields", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "isId": true,
          "name": "id",
          "type": "string",
        },
        Object {
          "name": "createdAt",
          "type": "date",
        },
        Object {
          "isReference": true,
          "name": "typeId",
          "type": "string",
        },
        Object {
          "isRequired": true,
          "length": 200,
          "name": "title",
          "type": "string",
        },
        Object {
          "length": 1000,
          "name": "message",
          "type": "string",
        },
        Object {
          "enumeration": Array [
            "un-addressed",
            "addressed",
            "closed",
          ],
          "name": "state",
          "type": "enum",
        },
        Object {
          "isReference": true,
          "name": "createdById",
          "type": "string",
        },
      ]
    `);
  });

  it("should order entity fields when provided", async () => {
    await setupAppConfigTestData({
      entity_fields_orders: {
        "base-model": ["message", "title", "typeId"],
      },
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      Array [
        Object {
          "length": 1000,
          "name": "message",
          "type": "string",
        },
        Object {
          "isRequired": true,
          "length": 200,
          "name": "title",
          "type": "string",
        },
        Object {
          "isReference": true,
          "name": "typeId",
          "type": "string",
        },
        Object {
          "isId": true,
          "name": "id",
          "type": "string",
        },
        Object {
          "name": "createdAt",
          "type": "date",
        },
        Object {
          "enumeration": Array [
            "un-addressed",
            "addressed",
            "closed",
          ],
          "name": "state",
          "type": "enum",
        },
        Object {
          "isReference": true,
          "name": "createdById",
          "type": "string",
        },
      ]
    `);
  });
});
