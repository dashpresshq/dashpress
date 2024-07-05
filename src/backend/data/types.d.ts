import type { PaginatedData, QueryFilterSchema } from "shared/types/data";
import type { IAccountProfile } from "shared/types/user";

export interface IPaginationFilters {
  take: number;
  page: number;
  orderBy?: "asc" | "desc";
  sortBy?: string;
}

export interface IDataApiService {
  fetchData(
    entity: string,
    select: string[],
    queryFilter: QueryFilterSchema,
    dataFetchingModifiers: IPaginationFilters
  ): Promise<Record<string, unknown>[]>;

  readData(
    entity: string,
    select: string[],
    query: QueryFilterSchema
  ): Promise<Record<string, unknown>>;

  countData(entity: string, queryFilter: QueryFilterSchema): Promise<number>;

  create(
    entity: string,
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<number | string>;

  update(
    entity: string,
    dataId: string,
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<void>;

  delete(
    entity: string,
    id: string,
    accountProfile: IAccountProfile
  ): Promise<void>;

  referenceData(entity: string, id: string): Promise<string>;

  tableData(
    entity: string,
    queryFilters: QueryFilterSchema,
    paginationFilters: IPaginationFilters
  ): Promise<PaginatedData<unknown>>;
}
