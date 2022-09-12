import { TemplateService } from "shared/lib/templates";
import { IEntityField, QueryFilter } from "shared/types";
import { FilterOperators } from "@hadmean/chromista";
import { IFieldValidationItem } from "shared/validations/types";
// import { runValidationError } from "shared/validations/run";
import noop from "lodash/noop";
import { NotFoundError } from "backend/lib/errors";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { EntitiesService, entitiesService } from "../entities/entities.service";
import { DataService, dataService } from "./data.service";
import { IPaginationFilters } from "./types";

const DEFAULT_LIST_LIMIT = 50;

const GOOD_FIELD_TYPES_FOR_LIST: IEntityField["type"][] = ["enum", "string"];

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
        // TODO relationshipSettings.fields.map((field) => ({
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

    if (relationshipSettings.fields.length > 0) {
      return relationshipSettings;
    }
    const [hiddenColumns, primaryField, entityFields] = await Promise.all([
      this._configurationService.show<string[]>(
        "hidden_entity_table_columns",
        entity
      ),
      this._entitiesService.getEntityPrimaryField(entity),
      this._entitiesService.getEntityFields(entity),
    ]);
    const displayField =
      entityFields.filter((field) => {
        return (
          field.name !== primaryField &&
          !hiddenColumns.includes(field.name) &&
          GOOD_FIELD_TYPES_FOR_LIST.includes(field.type)
        );
      })[0]?.name || primaryField;

    const configuration = {
      fields: [displayField],
      format: `{{ ${displayField} }}`,
    };

    await this._configurationService.upsert(
      "entity_relation_template",
      configuration,
      entity
    );
    // :eyes
    return configuration;
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

  private async getAllowedCrudsFieldsToShow(
    entity: string,
    crudKey:
      | "hidden_entity_details_columns"
      | "hidden_entity_create_columns"
      | "hidden_entity_table_columns"
      | "hidden_entity_update_columns"
  ): Promise<string[]> {
    const [hiddenFields, entityFields] = await Promise.all([
      this._configurationService.show<string[]>(crudKey, entity),
      this._entitiesService.getEntityFields(entity),
    ]);

    if (hiddenFields.length === 0) {
      return entityFields.map(({ name }) => name);
    }

    const hiddenFieldsMap = Object.fromEntries(
      hiddenFields.map((field) => [field, 1])
    );

    return entityFields
      .filter((entityField) => !hiddenFieldsMap[entityField.name])
      .map(({ name }) => name);
  }

  async showData(entity: string, id: string) {
    const [fieldsToShow, primaryField] = await Promise.all([
      this.getAllowedCrudsFieldsToShow(entity, "hidden_entity_details_columns"),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);
    const data = await this._dataService.show(entity, fieldsToShow, {
      [primaryField]: id,
    });
    if (!data) {
      throw new NotFoundError(
        `Entity '${entity}' with id '${id}' is not found`
      );
    }
    return data;
  }

  async createData(entity: string, data: Record<string, unknown>) {
    // validate the createData values
    const [allowedFields, primaryField, entityValidations] = await Promise.all([
      this.getAllowedCrudsFieldsToShow(entity, "hidden_entity_create_columns"),
      this._entitiesService.getEntityPrimaryField(entity),
      this._configurationService.show<Record<string, IFieldValidationItem[]>>(
        "entity_validations",
        entity
      ),
    ]);

    noop(entityValidations);

    return {
      id: await this._dataService.create(
        entity,
        this.returnOnlyDataThatAreAllowed(data, allowedFields),
        primaryField
      ),
    };
  }

  async updateData(
    entity: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<void> {
    // validate the updateData values

    const [allowedFields, primaryField, entityValidations] = await Promise.all([
      this.getAllowedCrudsFieldsToShow(entity, "hidden_entity_update_columns"),
      this._entitiesService.getEntityPrimaryField(entity),
      this._configurationService.show<Record<string, IFieldValidationItem[]>>(
        "entity_validations",
        entity
      ),
    ]);

    noop(entityValidations);

    // const validations = runValidationError({})(data);

    // console.log(entityValidations);

    await this._dataService.update(
      entity,
      {
        [primaryField]: id,
      },
      this.returnOnlyDataThatAreAllowed(data, allowedFields)
    );
  }

  private returnOnlyDataThatAreAllowed(
    data: Record<string, unknown>,
    allowedFields: string[]
  ) {
    return Object.fromEntries(
      allowedFields.map((field) => [field, data[field]])
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
    const [data, totalRecords] = await Promise.all([
      this._dataService.list(
        entity,
        await this.getAllowedCrudsFieldsToShow(
          entity,
          "hidden_entity_table_columns"
        ),
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
