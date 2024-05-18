import { ReactNode } from "react";
import { QueryClient, QueryCache } from "@tanstack/react-query";
import {
  AsyncStorage,
  MaybePromise,
  PersistQueryClientProvider,
  PersistedClient,
} from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";

export const queryCache = new QueryCache();

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 14, // 14 days
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const statusCode = (error as Response)?.status;
        if (!statusCode) {
          return true;
        }
        if (`${statusCode}`.startsWith("4")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const indexDbStorage: AsyncStorage = {
  getItem: get,
  setItem: set,
  removeItem: del,
};

const asyncStoragePersister = createAsyncStoragePersister({
  key: "__dashpress__persist__",
  storage: indexDbStorage,
  throttleTime: 1000 * 10, // 10 secs
  serialize: (client: PersistedClient) =>
    client as unknown as MaybePromise<string>,
  deserialize: (cache: string) => {
    return cache as unknown as MaybePromise<PersistedClient>;
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        persister: asyncStoragePersister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.state.status === "success" && !!query.meta?.persist;
          },
        },
      }}
      onSuccess={() => {
        queryClient.invalidateQueries();
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
