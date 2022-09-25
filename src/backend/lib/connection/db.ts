import knex, { Knex } from "knex";
import { IDataSourceCredentials, SupportedDataSources } from "shared/types";
import { connectionManager } from "./_manager";

const SupportedDataSourceToKnexClientMap: Record<
  Partial<SupportedDataSources>,
  string
> = {
  mssql: "tedious",
  postgres: "pg",
  mysql: "mysql2",
  sqlite: "better-sqlite3",
};

const handleStringCredentials = (credentials: string) => {
  if (credentials.startsWith("sqlite")) {
    return knex({
      client: "better-sqlite3",
      connection: {
        filename: credentials.split(":")[1],
      },
      useNullAsDefault: true,
    });
  }

  return knex(credentials);
};

const make = (credentials: IDataSourceCredentials | string) => {
  if (typeof credentials === "string") {
    return handleStringCredentials(credentials);
  }

  if (credentials.connectionString) {
    return handleStringCredentials(credentials.connectionString);
  }

  return knex({
    client: SupportedDataSourceToKnexClientMap[credentials.dataSourceType],

    connection: {
      database: credentials.database,
      user: credentials.user,
      password: credentials.password,
      host: credentials.host,
      filename: credentials.filename,
      port: credentials.port,
      ssl: credentials.ssl,
    },
  });
};

const verify = async (connection: Knex) => {
  await connection.raw("SELECT 1");
};

export const getDbConnection = async (
  credentials: IDataSourceCredentials | string
) => {
  return await connectionManager(credentials, {
    make,
    verify,
  });
};
