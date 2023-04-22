import { QueryFilter } from "shared/types/data";
import { ILabelValue } from "types";
import { DataApiService, dataApiService } from "./data.service";
import { IPaginationFilters } from "./types";

export class DataApiController {
  constructor(private _dataApiService: DataApiService) {}

  async tableData(
    entity: string,
    queryFilters: QueryFilter[],
    paginationFilters: IPaginationFilters
  ) {
    return await this._dataApiService.tableData(
      entity,
      queryFilters,
      paginationFilters
    );
  }

  async listData(entity: string, searchValue?: string): Promise<ILabelValue[]> {
    return await this._dataApiService.listData(entity, searchValue);
  }

  async showData(
    entity: string,
    id: string | number
  ): Promise<Record<string, unknown>> {
    return await this._dataApiService.showData(entity, id);
  }

  async countData(
    entity: string,
    queryFilters: QueryFilter[]
  ): Promise<{ count: number }> {
    return {
      count: await this._dataApiService.count(entity, queryFilters),
    };
  }

  async referenceData(entity: string, id: string): Promise<string> {
    return await this._dataApiService.referenceData(entity, id);
  }

  async createData(
    entity: string,
    data: Record<string, unknown>
  ): Promise<{ id: string | number }> {
    return { id: await this._dataApiService.create(entity, data) };
  }

  async updateData(
    entity: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<void> {
    return await this._dataApiService.update(entity, id, data);
  }

  async deleteData(entity: string, id: string): Promise<void> {
    await this._dataApiService.delete(entity, id);
  }
}

export const dataApiController = new DataApiController(dataApiService);
