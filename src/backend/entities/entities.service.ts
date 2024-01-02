import { ILabelValue } from "shared/types/options";
import {
  configurationApiService,
  ConfigurationApiService,
} from "backend/configuration/configuration.service";
import { rolesApiService, RolesApiService } from "backend/roles/roles.service";
import { IApplicationService } from "backend/types";
import { noop } from "shared/lib/noop";
import { IDBSchema, IEntityField, IEntityRelation } from "shared/types/db";
import { DataCrudKeys } from "shared/types/data";
import { CRUD_KEY_CONFIG } from "shared/configurations/permissions";
import { sortListByOrder } from "shared/lib/array/sort";
import { SchemasApiService, schemasApiService } from "../schema/schema.service";
import { PortalFieldsFilterService } from "./portal";

export class EntitiesApiService implements IApplicationService {
  constructor(
    private _schemasApiService: SchemasApiService,
    private _configurationApiService: ConfigurationApiService,
    private _rolesApiService: RolesApiService
  ) {}

  async bootstrap() {
    noop();
  }

  private async getDBSchemaModels(): Promise<Record<string, IDBSchema>> {
    return Object.fromEntries(
      (await this._schemasApiService.getDBSchema()).map((model) => [
        model.name,
        model,
      ])
    );
  }

  async getActiveEntities(): Promise<ILabelValue[]> {
    const [hiddenEntities, entities] = await Promise.all([
      this._configurationApiService.show("disabled_entities"),
      this.getAllEntities(),
    ]);
    return entities.filter(({ value }) => !hiddenEntities.includes(value));
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    return (await this.getEntityFromSchema(entity)).fields;
  }

  async getOrderedEntityFields(entity: string) {
    const [entityFields, entityFieldsOrder] = await Promise.all([
      this.getEntityFields(entity),
      this._configurationApiService.show("entity_fields_orders", entity),
    ]);

    sortListByOrder(
      entityFieldsOrder,
      entityFields as unknown as Record<string, unknown>[],
      "name" as keyof IEntityField
    );

    return entityFields;
  }

  async getEntityFirstFieldType(
    entity: string,
    fieldType: IEntityField["type"]
  ): Promise<string | undefined> {
    const allFields = await this.getEntityFields(entity);
    return allFields.find(({ type }) => {
      return type === fieldType;
    })?.name;
  }

  async getEntityRelations(entity: string): Promise<IDBSchema["relations"]> {
    return (await this.getEntityFromSchema(entity)).relations;
  }

  async getEntityPrimaryField(entity: string): Promise<string> {
    const primaryField = (await this.getEntityFields(entity)).find(
      ({ isId }) => isId
    )?.name;

    if (!primaryField) {
      throw new Error(
        "This entity doesn't have a primary key. Kindly ask your administrator to add one then restart the application and this error will go away."
      );
    }

    return primaryField;
  }

  async getEntityFromSchema(entity: string): Promise<IDBSchema> {
    return (await this.getDBSchemaModels())[entity];
  }

  async getAllowedCrudsFieldsToShow(
    entity: string,
    crudKey: DataCrudKeys
  ): Promise<string[]> {
    const [configHiddenFields, entityFields] = await Promise.all([
      this._configurationApiService.show(CRUD_KEY_CONFIG[crudKey], entity),
      this.getEntityFields(entity),
    ]);

    const portalHiddenFields = await PortalFieldsFilterService.getFieldsToHide(
      entity,
      crudKey,
      entityFields.map(({ name }) => name)
    );

    const hiddenFields = [...configHiddenFields, ...portalHiddenFields];

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

  async entityExist(entity: string): Promise<boolean> {
    return !!(await this.getDBSchemaModels())[entity];
  }

  async isEntityDisabled(entity: string): Promise<boolean> {
    return (
      await this._configurationApiService.show("disabled_entities")
    ).includes(entity);
  }

  async getAllEntities(): Promise<ILabelValue[]> {
    return (await this._schemasApiService.getDBSchema()).map(({ name }) => ({
      value: name,
      label: name,
    }));
  }

  async getEntityValidRelations(
    entity: string
  ): Promise<IDBSchema["relations"]> {
    const [entityRelations, disabledEntities, hiddenEntity] = await Promise.all(
      [
        this.getEntityRelations(entity),
        this._configurationApiService.show("disabled_entities"),
        this._configurationApiService.show("hidden_entity_relations", entity),
      ]
    );

    return entityRelations.filter(
      ({ table }) =>
        !disabledEntities.includes(table) && !hiddenEntity.includes(table)
    );
  }

  async getEntityRelationsForUserRole(
    entity: string,
    userRole: string
  ): Promise<IEntityRelation[]> {
    const [validRelations, entityLabels, entityOrders] = await Promise.all([
      this.getEntityValidRelations(entity),
      this._configurationApiService.show("entity_relations_labels", entity),
      this._configurationApiService.show("entity_relations_order", entity),
    ]);

    const allowedEntityRelation =
      await this._rolesApiService.filterPermittedEntities(
        userRole,
        validRelations,
        "table"
      );

    sortListByOrder(
      entityOrders,
      allowedEntityRelation as unknown[] as Record<string, unknown>[],
      "table"
    );

    return allowedEntityRelation.map((relation) => {
      const type = relation?.joinColumnOptions?.[0].name ? "toOne" : "toMany";

      return {
        table: relation.table,
        label: entityLabels[relation.table],
        type,
        field: relation?.joinColumnOptions?.[0].name,
        inverseToOneField:
          relation?.joinColumnOptions?.[0].tag === "inverse"
            ? relation?.joinColumnOptions?.[0].referencedColumnName
            : undefined,
      };
    });
  }
}

export const entitiesApiService = new EntitiesApiService(
  schemasApiService,
  configurationApiService,
  rolesApiService
);
