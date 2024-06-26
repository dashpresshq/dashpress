import { IPaginatedDataState } from "shared/types/data";

export const getQueryCachekey = (endPoint: string) =>
  endPoint
    ?.replace("?", "/")
    .split("/")
    .filter((x) => x);

export const getPaginatedDataCachekey = (
  endPoint: string,
  dataState: IPaginatedDataState<unknown>
) => [...getQueryCachekey(endPoint), JSON.stringify(dataState)];
