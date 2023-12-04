import { ILabelValue } from "shared/types/options";
import { IEntityField, IEntityRelation } from "shared/types/db";
import {
  ConfigurationApiService,
  configurationApiService,
} from "../configuration/configuration.service";
import { entitiesApiService, EntitiesApiService } from "./entities.service";

export class EntitiesApiController {
  constructor(
    private _entitiesApiService: EntitiesApiService,
    private _configurationApiService: ConfigurationApiService
  ) {}

  async getActiveEntities(): Promise<ILabelValue[]> {
    return await this._entitiesApiService.getActiveEntities();
  }

  async listAllEntities(): Promise<ILabelValue[]> {
    return await this._entitiesApiService.getAllEntities();
  }

  async listAllEntityRelations(entity: string): Promise<string[]> {
    const [entityRelations, disabledEntities] = await Promise.all([
      this._entitiesApiService.getEntityRelations(entity),
      this._configurationApiService.show("disabled_entities"),
    ]);

    const allowedEntityRelation = entityRelations.filter(
      ({ table }) => !disabledEntities.includes(table)
    );

    return allowedEntityRelation.map(({ table }) => table);
  }

  async getEntityRelations(
    entity: string,
    userRole: string
  ): Promise<IEntityRelation[]> {
    return await this._entitiesApiService.getEntityRelationsForUserRole(
      entity,
      userRole
    );
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    return await this._entitiesApiService.getOrderedEntityFields(entity);
  }
}

export const entitiesApiController = new EntitiesApiController(
  entitiesApiService,
  configurationApiService
);
