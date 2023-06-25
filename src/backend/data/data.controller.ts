import { QueryFilterSchema } from "shared/types/data";
import { ILabelValue } from "shared/types/options";
import { IAccountProfile } from "shared/types/user";
import { DataApiService, dataApiService } from "./data.service";
import { IPaginationFilters } from "./types";

export class DataApiController {
  constructor(private _dataApiService: DataApiService) {}

  async tableData(
    entity: string,
    queryFilters: QueryFilterSchema,
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
    id: string | number,
    column?: string
  ): Promise<Record<string, unknown>> {
    return await this._dataApiService.showData(entity, id, column);
  }

  async countData(
    entity: string,
    queryFilters: QueryFilterSchema
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
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<{ id: string | number }> {
    return {
      id: await this._dataApiService.create(entity, data, accountProfile),
    };
  }

  async updateData(
    entity: string,
    id: string,
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<void> {
    return await this._dataApiService.update(entity, id, data, accountProfile);
  }

  async deleteData(
    entity: string,
    id: string,
    accountProfile: IAccountProfile
  ): Promise<void> {
    await this._dataApiService.delete(entity, id, accountProfile);
  }
}

export const dataApiController = new DataApiController(dataApiService);
