import {
  ConfigurationService,
  configurationService,
} from "backend/configuration/configuration.service";
import noop from "lodash/noop";
import qs from "qs";
import { EntitiesService, entitiesService } from "../entities/entities.service";
import { DataService, dataService, QueryFilter } from "./data.service";

export class DataController {
  constructor(
    private _dataService: DataService,
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService
  ) {}

  async listData(entity: string): Promise<{ id: string; name: string }[]> {
    noop(entity);
    return [];
  }

  async referenceData(entity: string, id: string): Promise<string> {
    const data = await this._dataService.show<Record<string, unknown>>(
      entity,
      [],
      {
        [this._entitiesService.getEntityPrimaryField(entity)]: id,
      }
    );

    return Object.values(data)[4] as string;
  }

  async showData(entity: string, id: string) {
    // validate the showData fields
    // validate the showData values and that the fields
    // are showable and that this entity is showable
    return await this._dataService.show(entity, [], {
      [this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // validate the createData values and that the fields are createable
    // and that this entity is createable
    this._entitiesService.validateEntityFields(entity, Object.keys(data));
    await this._dataService.create(entity, data);
  }

  async updateData(entity: string, id: string, data: Record<string, unknown>) {
    // validate the updateData values and that the fields are updateable
    //  and that this entity is updateable
    this._entitiesService.validateEntityFields(entity, Object.keys(data));
    await this._dataService.update(
      entity,
      {
        [this._entitiesService.getEntityPrimaryField(entity)]: id,
      },
      data
    );
  }

  async deleteData(entity: string, id: string) {
    // validate the entity is deleteable
    await this._dataService.delete(entity, {
      [this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  transformRequestQueryToQueryFilter(
    query: Record<string, unknown>
  ): QueryFilter[] {
    const filters = (qs.parse(
      Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    )?.filters || []) as unknown as QueryFilter[];
    return filters;
  }

  async tableData(entity: string, query: Record<string, unknown>) {
    // TODO validate the entity is tableable

    const entityScalarFields =
      this._entitiesService.getScalarEntityFields(entity);

    const hiddenColumns = await this._configurationService.show<string[]>(
      "hidden_entity_table_columns",
      entity
    );

    const queryFilters = this.transformRequestQueryToQueryFilter(query);

    return {
      data: await this._dataService.list(
        entity,
        entityScalarFields
          .filter(({ name }) => !hiddenColumns.includes(name))
          .map(({ name }) => name),
        queryFilters,
        {
          take: Number(query.take),
          page: Number(query.page),
          orderBy:
            (query.orderBy as string).toLowerCase() === "desc" ? "desc" : "asc",
          sortBy: this._entitiesService.validateEntityField(
            entity,
            query.sortBy
          ),
        }
      ),
      pageIndex: query.page,
      pageSize: query.take,
      totalRecords: await this._dataService.count(entity, queryFilters),
    };
  }
}

export const dataController = new DataController(
  dataService,
  entitiesService,
  configurationService
);
