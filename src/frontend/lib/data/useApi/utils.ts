import { UseQueryResult } from "@tanstack/react-query";

export const isQueryIdle = (
  query: Pick<UseQueryResult<unknown>, "status" | "fetchStatus">
) => query.status === "pending" && query.fetchStatus === "idle";
