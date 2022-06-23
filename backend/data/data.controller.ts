import {
  ConfigurationService,
  configurationService,
} from "backend/configuration/configuration.service";
import { EntitiesService, entitiesService } from "../entities/entities.service";
import { dataService, DataService } from "./data.service";

export class DataController {
  constructor(
    private dataService: DataService,
    private entitiesService: EntitiesService,
    private configurationService: ConfigurationService
  ) {}

  async listData(entity: string) {}

  async showData(entity: string, id: string) {
    // validate the showData fields
    // validate the showData values and that the fields are showable and that this entity is showable
    return await this.dataService.show(entity, {
      [this.entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // validate the createData values and that the fields are createable and that this entity is createable
    this.entitiesService.validateEntityFields(entity, Object.keys(data));
    await this.dataService.create(entity, data);
  }

  async updateData(entity: string, id: string, data: Record<string, unknown>) {
    // validate the updateData values and that the fields are updateable and that this entity is updateable
    this.entitiesService.validateEntityFields(entity, Object.keys(data));
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

    const entityScalarFields =
      this.entitiesService.getScalarEntityFields(entity);

    const hiddenColumns = await this.configurationService.show<string[]>(
      "hidden_entity_table_columns",
      entity
    );

    return {
      data: await this.dataService.list(
        entity,
        entityScalarFields
          .filter(({ name }) => !hiddenColumns.includes(name))
          .map(({ name }) => name),
        {
          take: Number(filters.take),
          page: Number(filters.page),
          orderBy:
            (filters.orderBy as string).toLowerCase() === "desc"
              ? "desc"
              : "asc",
          sortBy: this.entitiesService.validateEntityField(
            entity,
            filters.sortBy
          ),
        }
      ),
      pageIndex: filters.page,
      pageSize: filters.take,
      totalRecords: await this.dataService.count(entity),
    };
  }
}

export const dataController = new DataController(
  dataService,
  entitiesService,
  configurationService
);
