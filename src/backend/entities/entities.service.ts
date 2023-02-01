import { IValueLabel } from "@hadmean/chromista/dist/types";
import {
  configurationService,
  ConfigurationService,
} from "backend/configuration/configuration.service";
import { IApplicationService } from "backend/types";
import noop from "lodash/noop";
import { IDBSchema, IEntityField } from "shared/types/db";
import { SchemasService, schemasService } from "../schema/schema.service";
import { sortByList } from "./utils";

export class EntitiesService implements IApplicationService {
  constructor(
    private _schemasService: SchemasService,
    private _configurationService: ConfigurationService
  ) {}

  async bootstrap() {
    noop();
  }

  private async getDBSchemaModels(): Promise<Record<string, IDBSchema>> {
    return Object.fromEntries(
      (await this._schemasService.getDBSchema()).map((model) => [
        model.name,
        model,
      ])
    );
  }

  async getActiveEntities(): Promise<IValueLabel[]> {
    const [hiddenEntities, entitiesOrder, entities] = await Promise.all([
      this._configurationService.show<string[]>("disabled_entities"),
      this._configurationService.show<string[]>("entities_order"),
      this.getAllEntities(),
    ]);
    const activeEntities = entities.filter(
      ({ value }) => !hiddenEntities.includes(value)
    );

    sortByList(
      activeEntities.sort((a, b) => a.value.localeCompare(b.value)),
      entitiesOrder,
      "value"
    );

    return activeEntities;
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    return (await this.getEntityFromSchema(entity)).fields;
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
    return (
      (await this.getEntityFields(entity)).find(({ isId }) => isId)?.name ||
      "id"
    );
  }

  async getEntityFromSchema(entity: string): Promise<IDBSchema> {
    return (await this.getDBSchemaModels())[entity];
  }

  async entityExist(entity: string): Promise<boolean> {
    return !!(await this.getDBSchemaModels())[entity];
  }

  async isEntityDisabled(entity: string): Promise<boolean> {
    return (
      await this._configurationService.show<string[]>("disabled_entities")
    ).includes(entity);
  }

  async getAllEntities(): Promise<{ value: string; label: string }[]> {
    return (await this._schemasService.getDBSchema()).map(({ name }) => ({
      value: name,
      label: name,
    }));
  }
}

export const entitiesService = new EntitiesService(
  schemasService,
  configurationService
);
