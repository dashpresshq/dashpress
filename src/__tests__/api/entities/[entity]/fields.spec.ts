import handler from "@/pages/api/entities/[entity]/fields";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

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
});
