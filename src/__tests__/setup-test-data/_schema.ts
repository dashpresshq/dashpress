import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IDBSchema } from "shared/types";

const TEST_DB_SCHEMA: IDBSchema[] = [
  {
    name: "foo",
    fields: [
      {
        name: "id",
        isId: true,
        type: "string",
      },
      {
        name: "createdAt",
        type: "date",
      },
      {
        name: "typeId",
        isReference: true,
        type: "string",
      },
      {
        name: "title",
        isRequired: true,
        length: 200,
        type: "string",
      },
      {
        name: "message",
        length: 1000,
        type: "string",
      },
      {
        name: "state",
        type: "enum",
        enumeration: ["un-addressed", "addressed", "closed"],
      },
      {
        name: "createdById",
        isReference: true,
        type: "string",
      },
    ],
    relations: [
      {
        table: "users",
        relationType: "ManyToOne",
        joinColumnOptions: [
          {
            name: "addressedById",
            referencedColumnName: "id",
          },
        ],
      },
      {
        table: "users",
        relationType: "ManyToOne",
        joinColumnOptions: [
          {
            name: "createdById",
            referencedColumnName: "id",
          },
        ],
      },
      {
        table: "courses",
        relationType: "ManyToOne",
        joinColumnOptions: [
          {
            name: "typeId",
            referencedColumnName: "id",
          },
        ],
      },
      {
        table: "contactUsThread",
        relationType: "OneToMany",
      },
    ],
    uniqueFields: [["id"]],
  },
  {
    name: "bar",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
  {
    name: "baz",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
  {
    name: "fish",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
];

export const setupSchemaTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IDBSchema>("schema");

  await configPersistenceService.resetToEmpty();

  await configPersistenceService.saveAllItems("name", TEST_DB_SCHEMA);
};
