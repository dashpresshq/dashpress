import { IEntityField } from "../entities/types";

export interface IJsonSchemaEnum {
  name: string;
  dbName: string | null;
  values: {
    name: string;
    dbName: string | null;
  }[];
}

export interface IJsonSchemaModel {
  name: string;
  dbName: string[];
  fields: IEntityField[];
}

export interface IJsonSchema {
  enums: IJsonSchemaEnum[];
  models: IJsonSchemaModel[];
  types: never[];
}
