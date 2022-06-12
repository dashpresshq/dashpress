import { dataService, DataService } from "./data.service";

export class DataController {
  constructor(private dataService: DataService) {}

  async listData(entity: string) {}

  async showData(entity: string, id: string) {}

  async createData(entity: string, data: Record<string, unknown>) {}

  async updateData(entity: string, id: string, data: Record<string, unknown>) {}

  async deleteData(entity: string, id: string) {}

  async tableData(entity: string, filters: Record<string, unknown>) {
    return {
      data: await this.dataService.list(entity, {
        take: Number(filters.take),
        page: Number(filters.page),
        orderBy: filters.orderBy + "",
        sortBy: filters.sortBy + "",
      }),
      pageIndex: filters.page,
      pageSize: filters.take,
      totalRecord: await this.dataService.count(entity),
    };
  }
}

export const dataController = new DataController(dataService);
