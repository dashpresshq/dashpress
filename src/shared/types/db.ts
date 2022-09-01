interface IDBSchemaRelation {
  table: string;
  relationType: string;
  joinColumnOptions?: {
    name: string;
    referencedColumnName: string;
  }[];
}

export interface IEntityRelation {
  table: string;
  label: string;
  field?: string;
  type: "toOne" | "toMany";
}

export interface IEntityField {
  name: string;
  isRequired?: true;
  length?: number;
  isId?: true;
  isReference?: true;
  type: "string" | "number" | "boolean" | "date" | "enum";
  enumeration?: string[];
}

export interface IDBSchema {
  name: string;
  fields: IEntityField[];
  uniqueFields: string[][];
  relations: IDBSchemaRelation[];
}

export enum SupportedDatabaseTypes {
  Postgres = "postgres",
  MySql = "mysql",
  MsSql = "mssql",
  Sqlite = "sqlite",
}

export type IDBCredentials = {
  connectionString: string;
  databaseType: SupportedDatabaseTypes;
  host: string;
  user: string;
  password: string;
  schemaNames: string[];
  database: string;
  port: number;
  ssl: boolean;
};
