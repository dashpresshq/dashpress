import { PaginatedData } from "shared/types/data";
import { IPaginationFilters } from "./types";

export const makeTableData = (
  [data, totalRecords]: [unknown[], number],
  paginationFilters: IPaginationFilters
): PaginatedData<unknown> => ({
  data,
  pageIndex: paginationFilters.page,
  pageSize: paginationFilters.take,
  totalRecords,
});
