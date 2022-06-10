import { dataService, DataService } from "./data.service";

export class DataController {
  constructor(private dataService: DataService) {}

  listData(model: string) {}

  showData(model: string) {}

  createData(model: string) {}

  updateData(model: string) {}

  deleteData(model: string) {}

  async tableData(model: string, filters: Record<string, unknown>) {
    return {
      data: await this.dataService.list(model),
      pageIndex: 1,
      pageSize: 1,
      totalRecord: await this.dataService.count(model),
    };
  }
}

export const dataController = new DataController(dataService);
