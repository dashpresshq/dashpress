const SAVED_CONNECTIONS: Record<string, any> = {};

function getConnectionHashKey(dbCredentials: unknown): string {
  return typeof dbCredentials === "string"
    ? dbCredentials
    : JSON.stringify(dbCredentials);
}

export async function connectionManager<T, K>(
  credentials: T,
  implementation: {
    make: (credentials: T) => K;
    verify: (connection: K) => Promise<void>;
  }
): Promise<K> {
  const savedConnection = SAVED_CONNECTIONS[getConnectionHashKey(credentials)];

  if (savedConnection) {
    return savedConnection;
  }

  const connection = implementation.make(credentials);

  await implementation.verify(connection);

  SAVED_CONNECTIONS[getConnectionHashKey(credentials)] = connection;

  return connection;
}
