import { Knex } from "knex";
import { makeDbConnection } from "@hadmean/bacteria";
import { IDataSourceCredentials } from "shared/types";
import { connectionManager } from "./_manager";

const verify = async (connection: Knex) => {
  await connection.raw("SELECT 1");
};

export const getDbConnection = async (
  credentials: IDataSourceCredentials | string
): Promise<Knex<any, any[]>> => {
  return await connectionManager<
    IDataSourceCredentials | string,
    Knex<any, any[]>
  >(credentials, {
    make: (credentials$1) => {
      return makeDbConnection(credentials$1) as unknown as Knex<any, any[]>;
    },
    verify,
  });
};
