import { IApplicationService } from "backend/types";
import { NotFoundError, progammingError } from "backend/lib/errors";
import { QueryFilter } from "shared/types/data";
import {
  actionsService,
  ActionsService,
} from "backend/actions/actions.service";
import { BaseAction } from "shared/types/actions";
import { IFieldValidationItem } from "shared/validations/types";
import noop from "lodash/noop";
import { IEntityField } from "shared/types/db";
import { TemplateService } from "shared/lib/templates";
import { FilterOperators } from "@hadmean/protozoa";
import { rDBMSDataService, RDBMSDataService } from "./data-access/RDBMS";
import { IPaginationFilters } from "./types";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { EntitiesService, entitiesService } from "../entities/entities.service";

const DEFAULT_LIST_LIMIT = 50;

const GOOD_FIELD_TYPES_FOR_LIST: IEntityField["type"][] = ["enum", "string"];

export class DataService implements IApplicationService {
  constructor(
    private _rDBMSDataService: RDBMSDataService,
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService,
    private _actionsService: ActionsService
  ) {}

  async bootstrap() {
    this.getDataAccessInstance().bootstrap();
  }

  private getDataAccessInstance() {
    return this._rDBMSDataService;
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: IPaginationFilters
  ): Promise<Record<string, unknown>[]> {
    return await this.getDataAccessInstance().list(
      entity,
      select,
      queryFilter,
      dataFetchingModifiers
    );
  }

  private async show<T>(
    entity: string,
    select: string[],
    query: Record<string, unknown>
  ): Promise<T> {
    progammingError(
      "We dont do that here, Please define the fields you want to select",
      select.length === 0
    );
    return await this.getDataAccessInstance().read<T>(entity, select, query);
  }

  async referenceData(entity: string, id: string): Promise<string> {
    const [relationshipSettings, primaryField] = await Promise.all([
      this.getRelationshipSettings(entity),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);

    const data = await this.show<Record<string, unknown>>(
      entity,
      relationshipSettings.fields,
      {
        // :eyes we are assuming that all reference fields goes to the primaryField
        [primaryField]: id,
      }
    );

    return TemplateService.compile(relationshipSettings.format, data);
  }

  async showData(
    entity: string,
    id: string | number
  ): Promise<Record<string, unknown>> {
    const [fieldsToShow, primaryField] = await Promise.all([
      this.getAllowedCrudsFieldsToShow(entity, "hidden_entity_details_columns"),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);
    const data = await this.show<Record<string, unknown>>(
      entity,
      fieldsToShow,
      {
        [primaryField]: id,
      }
    );
    if (!data) {
      throw new NotFoundError(
        `Entity '${entity}' with id '${id}' is not found`
      );
    }
    return data;
  }

  private returnOnlyDataThatAreAllowed(
    data: Record<string, unknown>,
    allowedFields: string[]
  ) {
    return Object.fromEntries(
      allowedFields.map((field) => [field, data[field]])
    );
  }

  async create(
    entity: string,
    data: Record<string, unknown>
  ): Promise<string | number> {
    // TODO validate the createData values
    const [allowedFields, primaryField, entityValidations] = await Promise.all([
      this.getAllowedCrudsFieldsToShow(entity, "hidden_entity_create_columns"),
      this._entitiesService.getEntityPrimaryField(entity),
      this._configurationService.show<Record<string, IFieldValidationItem[]>>(
        "entity_validations",
        entity
      ),
    ]);

    noop(entityValidations);

    const id = await this.getDataAccessInstance().create(
      entity,
      this.returnOnlyDataThatAreAllowed(data, allowedFields),
      primaryField
    );

    await this._actionsService.runAction(
      entity,
      BaseAction.Create,
      async () => await this.showData(entity, id)
    );

    return id;
  }

  async listData(
    entity: string,
    searchValue?: string
  ): Promise<{ value: string; label: string }[]> {
    const [relationshipSettings, primaryField] = await Promise.all([
      this.getRelationshipSettings(entity),
      this._entitiesService.getEntityPrimaryField(entity),
    ]);

    const data = await this.getDataAccessInstance().list(
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

  async paginateData(
    entity: string,
    queryFilters: QueryFilter[],
    paginationFilters: IPaginationFilters
  ): Promise<[unknown, number]> {
    const [data, totalRecords] = await Promise.all([
      this.getDataAccessInstance().list(
        entity,
        await this.getAllowedCrudsFieldsToShow(
          entity,
          "hidden_entity_table_columns"
        ),
        queryFilters,
        paginationFilters
      ),
      this.getDataAccessInstance().count(entity, queryFilters),
    ]);

    return [data, totalRecords];
  }

  async update(
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

    await this.getDataAccessInstance().update(
      entity,
      {
        [primaryField]: id,
      },
      this.returnOnlyDataThatAreAllowed(data, allowedFields)
    );

    await this._actionsService.runAction(
      entity,
      BaseAction.Update,
      async () => await this.showData(entity, id)
    );
  }

  async delete(entity: string, id: string): Promise<void> {
    await this._actionsService.runAction(
      entity,
      BaseAction.Delete,
      async () => await this.showData(entity, id)
    );

    return await this.getDataAccessInstance().delete(entity, {
      [await this._entitiesService.getEntityPrimaryField(entity)]: id,
    });
  }

  async count(entity: string, queryFilter: QueryFilter[]): Promise<number> {
    return await this.getDataAccessInstance().count(entity, queryFilter);
  }

  async getAllowedCrudsFieldsToShow(
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
    return configuration;
  }
}

export const dataService = new DataService(
  rDBMSDataService,
  entitiesService,
  configurationService,
  actionsService
);
