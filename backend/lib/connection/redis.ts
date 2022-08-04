import { createClient, RedisClientType } from "redis";

export const getRedisConnection = async (
  connectionString?: string
): Promise<RedisClientType> => {
  try {
    const client = createClient({
      url: connectionString,
    });
    await client.connect();
    await client.get("test");
    return client as RedisClientType;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error", error);
    throw error;
  }
};
