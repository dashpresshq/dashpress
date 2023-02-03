import { QueryFilter } from "shared/types/data";
import { ILabelValue } from "types";
import { DataService, dataService } from "./data.service";
import { IPaginationFilters } from "./types";

export class DataController {
  constructor(private _dataService: DataService) {}

  async tableData(
    entity: string,
    queryFilters: QueryFilter[],
    paginationFilters: IPaginationFilters
  ) {
    const [data, totalRecords] = await this._dataService.paginateData(
      entity,
      queryFilters,
      paginationFilters
    );

    return {
      data,
      pageIndex: paginationFilters.page,
      pageSize: paginationFilters.take,
      totalRecords,
    };
  }

  async listData(entity: string, searchValue?: string): Promise<ILabelValue[]> {
    return await this._dataService.listData(entity, searchValue);
  }

  async showData(
    entity: string,
    id: string | number
  ): Promise<Record<string, unknown>> {
    return await this._dataService.showData(entity, id);
  }

  async countData(
    entity: string,
    queryFilters: QueryFilter[]
  ): Promise<{ count: number }> {
    return {
      count: await this._dataService.count(entity, queryFilters),
    };
  }

  async referenceData(entity: string, id: string): Promise<string> {
    return await this._dataService.referenceData(entity, id);
  }

  async createData(
    entity: string,
    data: Record<string, unknown>
  ): Promise<{ id: string | number }> {
    return { id: await this._dataService.create(entity, data) };
  }

  async updateData(
    entity: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<void> {
    return await this._dataService.update(entity, id, data);
  }

  async deleteData(entity: string, id: string): Promise<void> {
    await this._dataService.delete(entity, id);
  }
}

export const dataController = new DataController(dataService);
