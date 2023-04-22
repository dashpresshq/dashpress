import { PaginatedData } from "@hadmean/protozoa";
import { IApplicationService } from "backend/types";
import { QueryFilter } from "shared/types/data";

export interface IPaginationFilters {
  take: number;
  page: number;
  orderBy?: string;
  sortBy?: string;
}

export const FOR_CODE_COV = 1;

export interface IDataApiService extends IApplicationService {
  list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: IPaginationFilters
  ): Promise<Record<string, unknown>[]>;

  read(
    entity: string,
    select: string[],
    query: Record<string, unknown>
  ): Promise<Record<string, unknown>>;

  count(entity: string, queryFilter: QueryFilter[]): Promise<number>;

  create(
    entity: string,
    data: Record<string, unknown>
  ): Promise<number | string>;

  update(
    entity: string,
    dataId: string,
    data: Record<string, unknown>
  ): Promise<void>;

  referenceData(entity: string, id: string): Promise<string>;

  tableData(
    entity: string,
    queryFilters: QueryFilter[],
    paginationFilters: IPaginationFilters
  ): Promise<PaginatedData<unknown>>;
}
