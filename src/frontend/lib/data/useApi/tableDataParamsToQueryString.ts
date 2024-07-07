import qs from "qs";

import type { IPaginatedDataState } from "@/shared/types/data";

export const tableDataParamsToQueryString = (
  dataState: IPaginatedDataState<unknown>
): string => {
  const sortBy = dataState?.sortBy?.[0]?.id;
  const orderBy = dataState?.sortBy?.[0]?.desc ? "desc" : "asc";

  return `?${qs.stringify({
    page: dataState.pageIndex + 1,
    take: dataState.pageSize,
    orderBy,
    sortBy,
    filters: dataState.filters,
  })}`;
};
