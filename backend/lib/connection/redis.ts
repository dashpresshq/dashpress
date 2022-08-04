// redis://alice:foobared@awesome.redis.server:6380
// redis[s]://[[username][:password]@][host][:port][/db-number]

import { createClient, RedisClientType } from "redis";

// interface IRedisCredentials {
//   ssl: boolean;
//   username: string;
//   password: string;
//   host: string;
//   port: number;
//   database?: number;
// }

export const getRedisConnection = async (
  connectionString?: string
): Promise<RedisClientType> => {
  const client = createClient({
    url: connectionString,
  });
  // :eyes
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.set("test_connection", "1");

  return client as RedisClientType;
};
