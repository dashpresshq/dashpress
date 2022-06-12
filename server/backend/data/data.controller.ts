import { dataService, DataService } from "./data.service";

export class DataController {
  constructor(private dataService: DataService) {}

  listData(model: string) {}

  showData(model: string) {}

  createData(model: string) {}

  updateData(model: string) {}

  deleteData(model: string) {}

  async tableData(model: string, filters: Record<string, unknown>) {
    console.log(filters);
    return {
      data: await this.dataService.list(model, filters),
      pageIndex: filters.page,
      pageSize: filters.take,
      totalRecord: await this.dataService.count(model),
    };
  }
}

export const dataController = new DataController(dataService);
