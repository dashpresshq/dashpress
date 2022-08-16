import knex from "knex";
import { IDBCredentials, SupportedDatabaseTypes } from "shared/types";

const SupportedDatabaseTypeToKnexClientMap: Record<
  SupportedDatabaseTypes,
  string
> = {
  mssql: "tedious",
  postgres: "pg",
  mysql: "mysql2",
  sqlite: "better-sqlite3",
};

export const getKnexConnection = async (dbCredentials: IDBCredentials) => {
  const connection = knex({
    client: SupportedDatabaseTypeToKnexClientMap[dbCredentials.databaseType],
    connection: {
      database: dbCredentials.database,
      user: dbCredentials.user,
      password: dbCredentials.password,
      host: dbCredentials.host,
      port: dbCredentials.port,
      ssl: dbCredentials.ssl,
    },
  });

  await connection.raw("SELECT 1");

  return connection;
};
