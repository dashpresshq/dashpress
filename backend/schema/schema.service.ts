import { introspect, Entity } from "@gothicgeeks/introspect";
import { ConfigData } from "../lib/config-data";
import {
  IDBSchema,
  IJsonSchema,
  IJsonSchemaEnum,
  IJsonSchemaModel,
} from "./schema.types";

export class SchemasService {
  private JSON_SCHEMA: IJsonSchema;

  private loadJsonSchema = (): IJsonSchema => {
    if (this.JSON_SCHEMA) {
      return this.JSON_SCHEMA;
    }
    introspect({
      databaseType: "postgres",
      host: "localhost",
      password: "password",
      schemaNames: ["public"],
      database: "kademiks",
      port: 5432,
      ssl: false,
      user: "postgres",
    }).then((data) => {
      ConfigData.put("schema", this.formatIntrospectData(data));
    });

    this.JSON_SCHEMA = require("../../.schema/schema.json");
    return this.JSON_SCHEMA;
  };

  formatIntrospectData(rawEntity: Entity[]): IDBSchema[] {
    const dbSchema = rawEntity.map((entity) => {
      return {
        name: entity.name,
        columns: entity.columns.map((column) => {
          const column$: IDBSchema["columns"][0] = {
            name: column.options.name,
            isRequired: column.options.nullable ? true : undefined,
            length: column.options.length,
            isId: column.primary ? true : undefined,
            isReference: column.isUsedInRelationAsOwner ? true : undefined,
            type: column.options.enum
              ? "enum"
              : (column.tscType.toLocaleLowerCase() as IDBSchema["columns"][0]["type"]),
            enumeration: column.options.enum,
          };
          return column$;
        }),
        relations: entity.relations.map((relation) => {
          const relation$: IDBSchema["relations"][0] = {
            table: relation.relatedTable,
            relationType: relation.relationType,
            joinColumnOptions: relation.joinColumnOptions,
          };
          return relation$;
        }),
        uniqueColumns: entity.indices
          .filter((index) => index.options.unique)
          .map((index) => index.columns),
      } as IDBSchema;
    });
    dbSchema.sort((a, b) => a.name.localeCompare(b.name));
    return dbSchema;
  }

  listJsonSchemaModels(): IJsonSchemaModel[] {
    return this.loadJsonSchema().models;
  }

  listJsonSchemaEnums(): IJsonSchemaEnum[] {
    return this.loadJsonSchema().enums;
  }
}

export const schemasService = new SchemasService();
