import {
  ConfigurationService,
  configurationService,
} from "backend/configuration/configuration.service";
import { ForbiddenError } from "backend/lib/errors";
import { TemplateService } from "shared/lib/templates";
import noop from "lodash/noop";
import qs from "qs";
import { IEntityCrudSettings } from "shared/configuration.constants";
import { EntitiesService, entitiesService } from "../entities/entities.service";
import { DataService, dataService, QueryFilter } from "./data.service";

export class DataController {
  constructor(
    private _dataService: DataService,
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService
  ) {}

  async listData(entity: string): Promise<{ id: string; name: string }[]> {
    // search by  const relationshipSettings = await this.getRelationshipSettings(entity);
    noop(entity);
    return [];
  }

  private async getRelationshipSettings(entity: string): Promise<{
    format: string;
    fields: string[];
  }> {
    const relationshipSettings = await this._configurationService.show<{
      format: string;
      fields: string[];
    }>("relationship_settings", entity);

    if (relationshipSettings.fields.length === 0) {
      // Will want to cache this
      // const field =
      // get all the fields that are showable then pick the first one by other
      return {
        fields: [],
        format: `{{ field }}`,
      };
    }

    return relationshipSettings;
  }

  async referenceData(entity: string, id: string): Promise<string> {
    const [relationshipSettings, primaryField] = await Promise.all([
      this.getRelationshipSettings(entity),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);

    const data = await this._dataService.show<Record<string, unknown>>(
      entity,
      relationshipSettings.fields,
      {
        [primaryField]: id,
      }
    );

    return TemplateService.compile(relationshipSettings.format, data);
  }

  async showData(entity: string, id: string) {
    // validate the showData fields
    // validate the showData values and that the fields are showable
    await this.canCrud(entity, "details");
    return await this._dataService.show(entity, [], {
      [await this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // validate the createData values and that the fields are createable
    await this.canCrud(entity, "create");
    await this._entitiesService.validateEntityFields(entity, Object.keys(data));
    const primaryField = await this._entitiesService.getEntityPrimaryField(
      entity
    );
    return { id: await this._dataService.create(entity, data, primaryField) };
  }

  async updateData(entity: string, id: string, data: Record<string, unknown>) {
    // validate the updateData values and that the fields are updateable
    await Promise.all([
      this.canCrud(entity, "update"),
      this._entitiesService.validateEntityFields(entity, Object.keys(data)),
    ]);

    await this._dataService.update(
      entity,
      {
        [await this._entitiesService.getEntityPrimaryField(entity)]: id,
      },
      data
    );
  }

  async deleteData(entity: string, id: string) {
    await this.canCrud(entity, "delete");
    await this._dataService.delete(entity, {
      [await this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async transformRequestQueryToQueryFilter(
    query: Record<string, unknown>,
    entity: string
  ): Promise<QueryFilter[]> {
    const filters = (qs.parse(
      Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
    )?.filters || []) as unknown as QueryFilter[];

    await this._entitiesService.validateEntityFields(
      entity,
      filters.map(({ id }) => id)
    );
    return filters;
  }

  private async canCrud(entity: string, action?: keyof IEntityCrudSettings) {
    const doCanAction = async () => {
      if (!action) {
        return true;
      }
      return (
        await this._configurationService.show<IEntityCrudSettings>(
          "entity_crud_settings",
          entity
        )
      )[action];
    };

    const [canAction, disabledEntities] = await Promise.all([
      doCanAction(),
      this._configurationService.show<string[]>("disabled_entities"),
    ]);

    if (!canAction || disabledEntities.includes(entity)) {
      throw new ForbiddenError();
    }
  }

  async countData(entity: string, query: Record<string, unknown>) {
    await this.canCrud(entity);
    const queryFilters = await this.transformRequestQueryToQueryFilter(
      query,
      entity
    );
    return {
      count: await this._dataService.count(entity, queryFilters),
    };
  }

  async tableData(entity: string, query: Record<string, unknown>) {
    await this.canCrud(entity);

    const [entityFields, hiddenColumns, sortBy, queryFilters] =
      await Promise.all([
        this._entitiesService.getEntityFields(entity),
        this._configurationService.show<string[]>(
          "hidden_entity_table_columns",
          entity
        ),
        this._entitiesService.validateEntityField(entity, query.sortBy),
        this.transformRequestQueryToQueryFilter(query, entity),
      ]);

    const take = Number(query.take) || 10;
    const page = Number(query.page) || 1;

    const [data, totalRecords] = await Promise.all([
      this._dataService.list(
        entity,
        entityFields
          .filter(({ name }) => !hiddenColumns.includes(name))
          .map(({ name }) => name),
        queryFilters,
        {
          take,
          page,
          orderBy:
            (query.orderBy as string)?.toLowerCase() === "desc"
              ? "desc"
              : "asc",
          sortBy,
        }
      ),
      this._dataService.count(entity, queryFilters),
    ]);

    return {
      data,
      pageIndex: page,
      pageSize: take,
      totalRecords,
    };
  }
}

export const dataController = new DataController(
  dataService,
  entitiesService,
  configurationService
);
