import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IDBSchema } from "shared/types";

const TEST_DB_SCHEMA: IDBSchema[] = [
  {
    name: "base-model",
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
        table: "friends",
        relationType: "ManyToOne",
        joinColumnOptions: [
          {
            name: "typeId",
            referencedColumnName: "id",
          },
        ],
      },
      {
        table: "profile",
        relationType: "OneToMany",
      },
      {
        table: "disabled-entity-1",
        relationType: "OneToMany",
      },
    ],
    uniqueFields: [["id"]],
  },
  {
    name: "disabled-entity-1",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
  {
    name: "disabled-entity-2",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
  {
    name: "secondary-model",
    fields: [],
    relations: [],
    uniqueFields: [],
  },
  {
    name: "tests",
    fields: [
      {
        name: "id",
        isId: true,
        type: "number",
      },
      {
        name: "name",
        isRequired: true,
        length: 200,
        type: "string",
      },
      {
        name: "age",
        isRequired: true,
        type: "number",
      },
      {
        name: "referenceId",
        isReference: true,
        type: "number",
      },
      {
        name: "verified",
        type: "boolean",
      },
      {
        name: "status",
        type: "enum",
        enumeration: ["opened", "closed", "inprogress"],
      },
      {
        name: "createdAt",
        type: "date",
      },
    ],
    relations: [],
    uniqueFields: [["id"]],
  },
];

export const setupSchemaTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IDBSchema>("schema");

  await configPersistenceService.resetState("name", TEST_DB_SCHEMA);
};
