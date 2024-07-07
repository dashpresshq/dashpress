import { credentialsApiService } from "@/backend/integrations-configurations";
import { createConfigDomainPersistenceService } from "@/backend/lib/config-persistence";
import { getDbConnection } from "@/backend/lib/connection/db";
import type { IDBSchema } from "@/shared/types/db";
import { setupCredentialsTestData } from "@/tests/api/setups";

import { SchemasApiService } from "../schema.service";

const setupTestDatabaseData = async (modified: boolean) => {
  const connection = await getDbConnection(
    `sqlite:./test-introspection.sqlite`
  );

  await connection.schema.dropTableIfExists("users");

  await connection.schema.createTable("users", (table) => {
    table.increments("id");
    table.integer("age");
    table.string("name");
    table.enum("status", ["opened", "closed", "inprogress"]);
    table.boolean("verified");
    table.integer("referenceId");
    table.date("createdAt");
  });

  await connection.schema.dropTableIfExists("profile");

  await connection.schema.createTable("profile", (table) => {
    table.increments("id");
    table.string("lastName");
    table.string("firstName");
    table.string("userId").index().references("id").inTable("users");
  });

  await connection.schema.dropTableIfExists("modified");

  if (modified) {
    await connection.schema.createTable("modified", (table) => {
      table.increments("id");
    });
  }
};

describe("SchemaService", () => {
  const schemaPersistenceService =
    createConfigDomainPersistenceService<IDBSchema>("schema");

  const schemasService = new SchemasApiService(
    schemaPersistenceService,
    credentialsApiService
  );

  beforeAll(async () => {
    await setupCredentialsTestData({
      DATABASE___dataSourceType:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      DATABASE___connectionString:
        /* JSON.stringify("sqlite:./test-introspection.sqlite") */
        "5ba13b95130bd6d2b43b40ebfeccdd7cf17a13ccf166ae8fd4ea8c53eec62b62d23f6c62ad22d963a2a89929c8b22d1003f54f7da16529f35bc0e0a55e3ee67f30e6ae6ac98af53e7f7ef2cc7c5fd7b196757eae601b006588c31ecff9c500c820f6202af1a88065a5d3fdd476607e0fa935749178f840ec6ccf745890ab422053c249e9",
    });
    await setupTestDatabaseData(false);

    await schemaPersistenceService.resetState("name", []);
  });

  beforeEach(() => {
    jest.resetModules();
  });

  it("should introspect database correctly when there is no schema data", async () => {
    expect(JSON.parse(JSON.stringify(await schemasService.getDBSchema())))
      .toMatchInlineSnapshot(`
      [
        {
          "fields": [
            {
              "isId": true,
              "isRequired": true,
              "name": "id",
              "type": "number",
            },
            {
              "length": 255,
              "name": "lastName",
              "type": "string",
            },
            {
              "length": 255,
              "name": "firstName",
              "type": "string",
            },
            {
              "isReference": true,
              "length": 255,
              "name": "userId",
              "type": "string",
            },
          ],
          "name": "profile",
          "relations": [
            {
              "joinColumnOptions": [
                {
                  "name": "userId",
                  "referencedColumnName": "id",
                },
              ],
              "relationType": "ManyToOne",
              "table": "users",
            },
          ],
          "uniqueFields": [],
        },
        {
          "fields": [
            {
              "isId": true,
              "isRequired": true,
              "name": "id",
              "type": "number",
            },
            {
              "name": "age",
              "type": "number",
            },
            {
              "length": 255,
              "name": "name",
              "type": "string",
            },
            {
              "name": "status",
              "type": "string",
            },
            {
              "name": "verified",
              "type": "boolean",
            },
            {
              "name": "referenceId",
              "type": "number",
            },
            {
              "name": "createdAt",
              "type": "date",
            },
          ],
          "name": "users",
          "relations": [
            {
              "relationType": "OneToMany",
              "table": "profile",
            },
          ],
          "uniqueFields": [],
        },
      ]
    `);
  });

  it("should not introspect database when schema data already exists when not on PROD", async () => {
    await setupTestDatabaseData(true);

    expect(await schemasService.getDBSchema()).toHaveLength(2);
  });

  // unable to mock process.env.NODE_ENV to be set to "test", load the json file then set back to "production"
  it.skip("should introspect database when schema data already exists when on PROD", async () => {
    await setupTestDatabaseData(true);

    // @ts-ignore
    process.env.NODE_ENV = "production";

    expect(await schemasService.getDBSchema()).toHaveLength(3);

    // @ts-ignore
    process.env.NODE_ENV = "test";
  });
});
