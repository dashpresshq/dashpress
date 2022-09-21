import handler from "pages/api/entities/[entity]/fields";
import {
  setupAppConfigTestData,
  setupAllTestData,
  createAuthenticatedMocks,
} from "__tests__/api/_test-utils";

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
      [
        {
          "isId": true,
          "name": "id",
          "type": "string",
        },
        {
          "name": "createdAt",
          "type": "date",
        },
        {
          "isReference": true,
          "name": "typeId",
          "type": "string",
        },
        {
          "isRequired": true,
          "length": 200,
          "name": "title",
          "type": "string",
        },
        {
          "length": 1000,
          "name": "message",
          "type": "string",
        },
        {
          "enumeration": [
            "un-addressed",
            "addressed",
            "closed",
          ],
          "name": "state",
          "type": "enum",
        },
        {
          "isReference": true,
          "name": "createdById",
          "type": "string",
        },
      ]
    `);
  });

  it("should order entity fields when provided", async () => {
    await setupAppConfigTestData({
      "entity_fields_orders__base-model": ["message", "title", "typeId"],
    });

    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        entity: "base-model",
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "length": 1000,
          "name": "message",
          "type": "string",
        },
        {
          "isRequired": true,
          "length": 200,
          "name": "title",
          "type": "string",
        },
        {
          "isReference": true,
          "name": "typeId",
          "type": "string",
        },
        {
          "isId": true,
          "name": "id",
          "type": "string",
        },
        {
          "name": "createdAt",
          "type": "date",
        },
        {
          "enumeration": [
            "un-addressed",
            "addressed",
            "closed",
          ],
          "name": "state",
          "type": "enum",
        },
        {
          "isReference": true,
          "name": "createdById",
          "type": "string",
        },
      ]
    `);
  });
});
