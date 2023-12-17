import { IApplicationService } from "backend/types";
import { PaginatedData, QueryFilterSchema } from "shared/types/data";
import { IAccountProfile } from "shared/types/user";

export interface IPaginationFilters {
  take: number;
  page: number;
  orderBy?: "asc" | "desc";
  sortBy?: string;
}

export const FOR_CODE_COV = 1;

export interface IDataApiService extends IApplicationService {
  fetchData(
    entity: string,
    select: string[],
    queryFilter: QueryFilterSchema,
    dataFetchingModifiers: IPaginationFilters
  ): Promise<Record<string, unknown>[]>;

  readData(
    entity: string,
    select: string[],
    query: Record<string, unknown>
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
