import { EntitiesService, entitiesService } from "../entities/entities.service";
import { dataService, DataService } from "./data.service";
// TODO vigorously validate the data here
export class DataController {
  constructor(
    private dataService: DataService,
    private entitiesService: EntitiesService
  ) {}

  async listData(entity: string) {}

  async showData(entity: string, id: string) {
    // validate the showData fields
    return await this.dataService.show(entity, {
      [this.entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // TODO validate all the fields
    // validate the createData fields
    // this.entitiesService.validateEntityField(entity, filters.sortBy)
    await this.dataService.create(entity, data);
  }

  async updateData(entity: string, id: string, data: Record<string, unknown>) {
    // TODO validate all the fields
    // this.entitiesService.validateEntityField(entity, filters.sortBy)
    // validate the updateData fields
    await this.dataService.update(
      entity,
      {
        [this.entitiesService.getEntityPrimaryField(entity)]: id,
      },
      data
    );
  }

  async deleteData(entity: string, id: string) {
    // validate the entity is deleteable
    await this.dataService.delete(entity, {
      [this.entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async tableData(entity: string, filters: Record<string, unknown>) {
    // validate the entity is tableable
    return {
      data: await this.dataService.list(entity, {
        take: Number(filters.take),
        page: Number(filters.page),
        orderBy:
          (filters.orderBy as string).toLowerCase() === "desc" ? "desc" : "asc",
        sortBy: this.entitiesService.validateEntityField(
          entity,
          filters.sortBy
        ),
      }),
      pageIndex: filters.page,
      pageSize: filters.take,
      totalRecord: await this.dataService.count(entity),
    };
  }
}

export const dataController = new DataController(dataService, entitiesService);
