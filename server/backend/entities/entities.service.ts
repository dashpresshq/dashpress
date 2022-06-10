import { IJsonSchema, IEntityField, IJsonSchemaModel } from "./types";

export class EntitiesService {
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

  getEntityFields = (entity: string): IEntityField[] => {
    return this.getEntityFromSchema(entity).fields;
  };

  getEntityFromSchema = (entity: string): IJsonSchemaModel => {
    return this.getJsonSchemaModels()[entity];
  };

  getAllEntities = () => {
    return this.listJsonSchemaModels().map(({ name }) => ({
      value: name,
      label: name,
    }));
  };
}


export const entitiesService = new EntitiesService();