import type { RedisClientType } from "redis";
import { createClient } from "redis";

import { connectionManager } from "./_manager";

const make = (credentials?: string) => {
  return createClient({
    url: credentials,
  }) as RedisClientType;
};

const verify = async (connection: RedisClientType) => {
  await connection.connect();
  await connection.get("test");
};

export const getRedisConnection = async (credentials?: string) => {
  return await connectionManager(credentials, {
    make,
    verify,
  });
};
