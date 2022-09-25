export enum SupportedDataSources {
  Postgres = "postgres",
  MySql = "mysql",
  MsSql = "mssql",
  Sqlite = "sqlite",
}

export type IDataSourceCredentials = {
  connectionString: string;
  dataSourceType: SupportedDataSources;
  host: string;
  user: string;
  password: string;
  filename: string;
  schemaNames: string[];
  database: string;
  port: number;
  ssl: boolean;
};

const DATABASE_FIELDS: Array<keyof IDataSourceCredentials> = [
  "host",
  "user",
  "password",
  "database",
  "port",
  "ssl",
];

export const DATA_SOURCES_CONFIG: Record<
  SupportedDataSources,
  {
    fields: Array<keyof IDataSourceCredentials>;
    port?: number;
  }
> = {
  [SupportedDataSources.Postgres]: {
    fields: DATABASE_FIELDS,
    port: 5432,
  },
  [SupportedDataSources.MsSql]: {
    fields: DATABASE_FIELDS,
    port: 1433,
  },
  [SupportedDataSources.MySql]: {
    fields: DATABASE_FIELDS,
    port: 3306,
  },
  [SupportedDataSources.Sqlite]: {
    fields: ["filename"],
  },
};
