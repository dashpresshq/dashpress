import { IValueLabel } from "@hadmean/chromista/dist/types";
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

  async getActiveEntities(): Promise<IValueLabel[]> {
    return await this._entitiesApiService.getActiveEntities();
  }

  async getUserMenuEntities(userRole: string): Promise<IValueLabel[]> {
    return await this._entitiesApiService.getUserMenuEntities(userRole);
  }

  async listAllEntities(): Promise<IValueLabel[]> {
    return await this._entitiesApiService.getAllEntities();
  }

  async listAllEntityRelations(entity: string): Promise<string[]> {
    const [entityRelations, disabledEntities] = await Promise.all([
      this._entitiesApiService.getEntityRelations(entity),
      this._configurationApiService.show<string[]>("disabled_entities"),
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
