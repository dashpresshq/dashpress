import { Knex } from "knex";
import { makeDbConnection } from "@hadmean/bacteria";
import { IDataSourceCredentials } from "shared/types";
import { connectionManager } from "./_manager";

const verify = async (connection: Knex) => {
  await connection.raw("SELECT 1");
};

export const getDbConnection = async (
  credentials: IDataSourceCredentials | string
) => {
  return await connectionManager(credentials, {
    make: makeDbConnection,
    verify,
  });
};
