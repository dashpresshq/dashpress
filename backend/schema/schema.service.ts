import { introspect } from "@gothicgeeks/introspect";
import { ConfigData } from "backend/lib/config-data";
import { IJsonSchema, IJsonSchemaEnum, IJsonSchemaModel } from "./schema.types";

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
      databaseName: "kademiks",
      port: 5432,
      ssl: false,
      user: "postgres",
    }).then((data) => {
      ConfigData.put("schema", data);
    });

    this.JSON_SCHEMA = require("../../.schema/schema.json");
    return this.JSON_SCHEMA;
  };

  listJsonSchemaModels(): IJsonSchemaModel[] {
    return this.loadJsonSchema().models;
  }

  listJsonSchemaEnums(): IJsonSchemaEnum[] {
    return this.loadJsonSchema().enums;
  }
}

export const schemasService = new SchemasService();
