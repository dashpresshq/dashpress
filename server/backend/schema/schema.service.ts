import { IJsonSchema, IJsonSchemaField, IJsonSchemaModel } from "./types";

export class SchemaService {
  private JSON_SCHEMA: IJsonSchema;

  private refreshSchema = () => {
    this.JSON_SCHEMA = null;
  };

  private loadJsonSchema = (): IJsonSchema => {
    if (this.JSON_SCHEMA) {
      return this.JSON_SCHEMA;
    }
    this.JSON_SCHEMA = require("../../.schema/schema.json");
    return this.JSON_SCHEMA;
  };

  private listJsonSchemaModels(): IJsonSchemaModel[] {
    return this.loadJsonSchema()["models"];
  }

  private getJsonSchemaModels = (): Record<string, IJsonSchemaModel> => {
    return Object.fromEntries(
      this.listJsonSchemaModels().map((model) => [model.name, model])
    );
  };

  getSchemaFields = (schema: string): IJsonSchemaField[] => {
    return this.getSchemaModel(schema).fields;
  };

  getSchemaModel = (schema: string): IJsonSchemaModel => {
    return this.getJsonSchemaModels()[schema];
  };

  getAllSchemas = () => {
    return this.listJsonSchemaModels().map(({ name }) => ({
      value: name,
      label: name,
    }));
  };
}


export const schemaService = new SchemaService();