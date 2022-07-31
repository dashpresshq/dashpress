export interface IEntityField {
  name: string;
  isRequired?: true;
  length?: number;
  isId?: true;
  isReference?: true;
  type: "string" | "number" | "boolean" | "date" | "enum";
  enumeration?: string[];
}

export interface IEntityRelation {
  table: string;
  relationType: string;
  joinColumnOptions?: {
    name: string;
    referencedColumnName: string;
  }[];
}

export interface IDBSchema {
  name: string;
  fields: IEntityField[];
  uniqueFields: string[][];
  relations: IEntityRelation[];
}

export interface ISuccessfullAuthenticationResponse {
  token: string;
}

export interface ISetupCheck {
  hasDbCredentials: boolean;
  hasUsers: boolean;
}

export enum SupportedDatabaseTypes {
  Postgres = "postgres",
  MySql = "mysql",
  MsSql = "mssql",
  Sqlite = "sqlite",
}

export type IDBCrendentials = {
  databaseType: SupportedDatabaseTypes;
  host: string;
  user: string;
  password: string;
  schemaNames: string[];
  database: string;
  port: number;
  ssl: boolean;
};
