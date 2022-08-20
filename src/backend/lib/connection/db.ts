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

const SAVED_CONNECTIONS: Record<string, any> = {};

const getConnection = (dbCredentials: IDBCredentials | string) => {
  if (typeof dbCredentials === "string") {
    return knex(dbCredentials);
  }
  return knex({
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
};

const getConnectionHashKey = (
  dbCredentials: IDBCredentials | string
): string => {
  return typeof dbCredentials === "string"
    ? dbCredentials
    : JSON.stringify(dbCredentials);
};

export const getKnexConnection = async (
  dbCredentials: IDBCredentials | string
) => {
  const savedConnection =
    SAVED_CONNECTIONS[getConnectionHashKey(dbCredentials)];

  if (savedConnection) {
    return savedConnection;
  }

  const connection = getConnection(dbCredentials);

  SAVED_CONNECTIONS[getConnectionHashKey(dbCredentials)] = connection;

  await connection.raw("SELECT 1");

  return connection;
};
