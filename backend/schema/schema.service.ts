import { IJsonSchema, IJsonSchemaEnum, IJsonSchemaModel } from './schema.types';

export class SchemasService {
  private JSON_SCHEMA: IJsonSchema;

  private loadJsonSchema = (): IJsonSchema => {
    if (this.JSON_SCHEMA) {
      return this.JSON_SCHEMA;
    }
    this.JSON_SCHEMA = require('../../.schema/schema.json');
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
