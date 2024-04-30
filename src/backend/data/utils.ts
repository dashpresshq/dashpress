import { PaginatedData } from "shared/types/data";
import { IPaginationFilters } from "./types";

export const makeTableData = (
  [data, totalRecords]: [Record<string, unknown>[], number],
  paginationFilters: IPaginationFilters
): PaginatedData<Record<string, unknown>> => ({
  data,
  pageIndex: paginationFilters.page,
  pageSize: paginationFilters.take,
  totalRecords,
});
