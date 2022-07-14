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

export interface IDBSchema {
  name: string;
  columns: {
    name: string;
    isRequired?: true;
    length?: number;
    isId?: true;
    isReference?: true;
    type: "string" | "number" | "boolean" | "date" | "enum";
    enumeration?: string[];
  }[];
  uniqueColumns: string[][];
  relations: {
    table: string;
    relationType: string;
    joinColumnOptions?: {
      name: string;
      referencedColumnName: string;
    };
  }[];
}
