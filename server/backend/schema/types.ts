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
  kind: "scalar" | "object"
  fields: IJsonSchemaField[];
}

export interface IJsonSchemaField {
  name: string;
  isRequired: boolean;
  isUnique: boolean;
  isId: true;
  hasDefaultValue: boolean;
  type: "String";
  default?: string | { name: string; args: never[] };
}

export interface IJsonSchema {
  enums: IJsonSchemaEnum[];
  models: IJsonSchemaModel[];
  types: never[];
}
