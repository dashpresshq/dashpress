import { NotFoundError, progammingError } from "backend/lib/errors";
import {
  FilterOperators,
  PaginatedData,
  QueryFilterSchema,
} from "shared/types/data";
import {
  actionsApiService,
  ActionsApiService,
} from "backend/actions/actions.service";
import { BaseAction } from "shared/types/actions";
import { IFieldValidationItem } from "shared/validations/types";
import { IEntityField } from "shared/types/db";
import { IAccountProfile } from "shared/types/user";
import { noop } from "shared/lib/noop";
import { compileTemplateString } from "shared/lib/strings/templates";
import { rDBMSDataApiService, RDBMSDataApiService } from "./data-access/RDBMS";
import { IDataApiService, IPaginationFilters } from "./types";
import {
  ConfigurationApiService,
  configurationApiService,
} from "../configuration/configuration.service";
import {
  EntitiesApiService,
  entitiesApiService,
} from "../entities/entities.service";
import { PortalDataHooksService } from "./portal";
import { makeTableData } from "./utils";

const DEFAULT_LIST_LIMIT = 50;

const GOOD_FIELD_TYPES_FOR_LIST: IEntityField["type"][] = ["enum", "string"];

export class DataApiService implements IDataApiService {
  constructor(
    private _rDBMSApiDataService: RDBMSDataApiService,
    private _entitiesApiService: EntitiesApiService,
    private _configurationApiService: ConfigurationApiService,
    private _actionsApiService: ActionsApiService
  ) {}

  async bootstrap() {
    this.getDataAccessInstance().bootstrap();
  }

  private getDataAccessInstance() {
    return this._rDBMSApiDataService;
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilterSchema,
    dataFetchingModifiers: IPaginationFilters
  ): Promise<Record<string, unknown>[]> {
    return await this.getDataAccessInstance().list(
      entity,
      select,
      queryFilter,
      dataFetchingModifiers
    );
  }

  async read<T>(
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
      this._entitiesApiService.getEntityPrimaryField(entity),
    ]);

    const data = await this.read<Record<string, unknown>>(
      entity,
      relationshipSettings.fields,
      {
        [primaryField]: id,
      }
    );

    return compileTemplateString(relationshipSettings.format, data);
  }

  async showData(
    entity: string,
    id: string | number,
    column?: string
  ): Promise<Record<string, unknown>> {
    const [fieldsToShow, columnField] = await Promise.all([
      this._entitiesApiService.getAllowedCrudsFieldsToShow(entity, "details"),
      column || this._entitiesApiService.getEntityPrimaryField(entity),
    ]);
    const data = await this.read<Record<string, unknown>>(
      entity,
      fieldsToShow,
      {
        [columnField]: id,
      }
    );
    if (!data) {
      throw new NotFoundError(
        `Entity '${entity}' with '${columnField}' '${id}' does not exist`
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
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<string | number> {
    // TODO validate the createData values
    const [allowedFields, primaryField, entityValidations] = await Promise.all([
      this._entitiesApiService.getAllowedCrudsFieldsToShow(entity, "create"),
      this._entitiesApiService.getEntityPrimaryField(entity),
      this._configurationApiService.show<
        Record<string, IFieldValidationItem[]>
      >("entity_validations", entity),
    ]);

    noop(entityValidations);

    await PortalDataHooksService.beforeCreate({
      dataApiService: this,
      entity,
      data,
    });

    const id = await this.getDataAccessInstance().create(
      entity,
      this.returnOnlyDataThatAreAllowed(data, allowedFields),
      primaryField
    );

    await PortalDataHooksService.afterCreate({
      dataApiService: this,
      entity,
      data,
      insertId: id,
    });

    await this._actionsApiService.runAction(
      entity,
      BaseAction.Create,
      async () => await this.showData(entity, id),
      accountProfile
    );

    return id;
  }

  async listData(
    entity: string,
    searchValue?: string
  ): Promise<{ value: string; label: string }[]> {
    const [relationshipSettings, primaryField] = await Promise.all([
      this.getRelationshipSettings(entity),
      this._entitiesApiService.getEntityPrimaryField(entity),
    ]);

    const data = await this.getDataAccessInstance().list(
      entity,
      [...relationshipSettings.fields, primaryField],
      {
        operator: "or",
        children: relationshipSettings.fields.map((field) => ({
          id: field,
          value: {
            operator: FilterOperators.CONTAINS,
            value: searchValue,
          },
        })),
      },
      {
        take: DEFAULT_LIST_LIMIT,
        page: 1,
      }
    );

    return data.map((datum: Record<string, unknown>) => {
      return {
        value: datum[primaryField],
        label: compileTemplateString(relationshipSettings.format, datum),
      };
    });
  }

  async tableData(
    entity: string,
    queryFilters: QueryFilterSchema,
    paginationFilters: IPaginationFilters
  ): Promise<PaginatedData<unknown>> {
    return makeTableData(
      await Promise.all([
        this.getDataAccessInstance().list(
          entity,
          await this._entitiesApiService.getAllowedCrudsFieldsToShow(
            entity,
            "table"
          ),
          queryFilters,
          paginationFilters
        ),
        this.getDataAccessInstance().count(entity, queryFilters),
      ]),
      paginationFilters
    );
  }

  async update(
    entity: string,
    id: string,
    data: Record<string, unknown>,
    accountProfile: IAccountProfile
  ): Promise<void> {
    const [allowedFields, primaryField, entityValidations] = await Promise.all([
      this._entitiesApiService.getAllowedCrudsFieldsToShow(entity, "update"),
      this._entitiesApiService.getEntityPrimaryField(entity),
      this._configurationApiService.show<
        Record<string, IFieldValidationItem[]>
      >("entity_validations", entity),
    ]);

    // validate only the fields presents in 'data'
    noop(entityValidations);

    // const validations = runValidationError({})(data);

    const beforeData = await PortalDataHooksService.beforeUpdate({
      dataApiService: this,
      entity,
      data,
      dataId: id,
    });

    await this.getDataAccessInstance().update(
      entity,
      {
        [primaryField]: id,
      },
      this.returnOnlyDataThatAreAllowed(data, allowedFields)
    );

    await PortalDataHooksService.afterUpdate({
      dataApiService: this,
      entity,
      beforeData,
      data,
      dataId: id,
    });

    await this._actionsApiService.runAction(
      entity,
      BaseAction.Update,
      async () => await this.showData(entity, id),
      accountProfile
    );
  }

  async delete(
    entity: string,
    id: string,
    accountProfile: IAccountProfile
  ): Promise<void> {
    await this._actionsApiService.runAction(
      entity,
      BaseAction.Delete,
      async () => await this.showData(entity, id),
      accountProfile
    );

    const beforeData = await PortalDataHooksService.beforeDelete({
      dataApiService: this,
      entity,
      dataId: id,
    });

    await this.getDataAccessInstance().delete(entity, {
      [await this._entitiesApiService.getEntityPrimaryField(entity)]: id,
    });

    await PortalDataHooksService.afterDelete({
      beforeData,
      dataApiService: this,
      entity,
      dataId: id,
    });
  }

  async count(entity: string, queryFilter: QueryFilterSchema): Promise<number> {
    return await this.getDataAccessInstance().count(entity, queryFilter);
  }

  private async getRelationshipSettings(entity: string): Promise<{
    format: string;
    fields: string[];
  }> {
    const relationshipSettings = await this._configurationApiService.show<{
      format: string;
      fields: string[];
    }>("entity_relation_template", entity);

    if (relationshipSettings.fields.length > 0) {
      return relationshipSettings;
    }
    const [hiddenColumns, primaryField, entityFields] = await Promise.all([
      this._configurationApiService.show<string[]>(
        "hidden_entity_table_columns",
        entity
      ),
      this._entitiesApiService.getEntityPrimaryField(entity),
      this._entitiesApiService.getEntityFields(entity),
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

    await this._configurationApiService.upsert(
      "entity_relation_template",
      configuration,
      entity
    );
    return configuration;
  }
}

export const dataApiService = new DataApiService(
  rDBMSDataApiService,
  entitiesApiService,
  configurationApiService,
  actionsApiService
);
