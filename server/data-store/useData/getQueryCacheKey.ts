import { IBEPaginatedDataState } from "./types";

export const getQueryCachekey = (endPoint: string) => {
  return endPoint.split("/");
};

export const getPaginatedDataCachekey = (
  endPoint: string,
  dataState: IBEPaginatedDataState
) => {
  return [...getQueryCachekey(endPoint), JSON.stringify(dataState)];
};
