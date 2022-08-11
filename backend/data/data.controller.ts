import { TemplateService } from "shared/lib/templates";
import { QueryFilter } from "shared/types";
import { FilterOperators } from "@gothicgeeks/design-system";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { EntitiesService, entitiesService } from "../entities/entities.service";
import { DataService, dataService } from "./data.service";
import { IPaginationFilters } from "./types";

const DEFAULT_LIST_LIMIT = 50;

export class DataController {
  constructor(
    private _dataService: DataService,
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService
  ) {}

  async listData(
    entity: string,
    searchValue?: string
  ): Promise<{ value: string; label: string }[]> {
    const [relationshipSettings, primaryField] = await Promise.all([
      this.getRelationshipSettings(entity),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);

    const data = await this._dataService.list(
      entity,
      [...relationshipSettings.fields, primaryField],
      [relationshipSettings.fields[0]].map((field) => ({
        // relationshipSettings.fields.map((field) => ({
        id: field,
        value: {
          operator: FilterOperators.CONTAINS,
          value: searchValue,
        },
      })),
      {
        take: DEFAULT_LIST_LIMIT,
        page: 1,
      }
    );

    return data.map((datum: Record<string, unknown>) => {
      return {
        value: datum[primaryField],
        label: TemplateService.compile(relationshipSettings.format, datum),
      };
    });
  }

  private async getRelationshipSettings(entity: string): Promise<{
    format: string;
    fields: string[];
  }> {
    const relationshipSettings = await this._configurationService.show<{
      format: string;
      fields: string[];
    }>("entity_relation_template", entity);

    if (relationshipSettings.fields.length === 0) {
      // TODO Will want to cache this
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
        // :eyes we are assuming that all reference fields goes to the primaryField
        [primaryField]: id,
      }
    );

    return TemplateService.compile(relationshipSettings.format, data);
  }

  async showData(entity: string, id: string) {
    // Send in the show fields
    return await this._dataService.show(entity, [], {
      [await this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // validate the createData values and that the fields are createable
    const primaryField = await this._entitiesService.getEntityPrimaryField(
      entity
    );
    return { id: await this._dataService.create(entity, data, primaryField) };
  }

  async updateData(entity: string, id: string, data: Record<string, unknown>) {
    // validate the updateData values and that the fields are updateable
    await this._dataService.update(
      entity,
      {
        [await this._entitiesService.getEntityPrimaryField(entity)]: id,
      },
      data
    );
  }

  async deleteData(entity: string, id: string) {
    await this._dataService.delete(entity, {
      [await this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async countData(entity: string, queryFilters: QueryFilter[]) {
    return {
      count: await this._dataService.count(entity, queryFilters),
    };
  }

  async tableData(
    entity: string,
    queryFilters: QueryFilter[],
    paginationFilters: IPaginationFilters
  ) {
    const [entityFields, hiddenColumns] = await Promise.all([
      this._entitiesService.getEntityFields(entity),
      this._configurationService.show<string[]>(
        "hidden_entity_table_columns",
        entity
      ),
    ]);

    const [data, totalRecords] = await Promise.all([
      this._dataService.list(
        entity,
        entityFields
          .filter(({ name }) => !hiddenColumns.includes(name))
          .map(({ name }) => name),
        queryFilters,
        paginationFilters
      ),
      this._dataService.count(entity, queryFilters),
    ]);

    return {
      data,
      pageIndex: paginationFilters.page,
      pageSize: paginationFilters.take,
      totalRecords,
    };
  }
}

export const dataController = new DataController(
  dataService,
  entitiesService,
  configurationService
);
