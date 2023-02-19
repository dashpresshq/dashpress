import { IValueLabel } from "@hadmean/chromista/dist/types";
import { rolesService, RolesService } from "backend/roles/roles.service";
import { IEntityField, IEntityRelation } from "shared/types/db";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { entitiesService, EntitiesService } from "./entities.service";

export class EntitiesController {
  constructor(
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService,
    private _rolesService: RolesService
  ) {}

  async getActiveEntities(): Promise<IValueLabel[]> {
    return await this._entitiesService.getActiveEntities();
  }

  async getUserActiveEntities(userRole: string): Promise<IValueLabel[]> {
    return await this._rolesService.filterPermittedEntities(
      userRole,
      await this._entitiesService.getActiveEntities(),
      "value"
    );
  }

  async listAllEntities(): Promise<IValueLabel[]> {
    return await this._entitiesService.getAllEntities();
  }

  async listAllEntityRelations(entity: string): Promise<string[]> {
    const [entityRelations, disabledEntities] = await Promise.all([
      this._entitiesService.getEntityRelations(entity),
      this._configurationService.show<string[]>("disabled_entities"),
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
    return await this._entitiesService.getEntityRelationsForUserRole(
      entity,
      userRole
    );
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    return await this._entitiesService.getOrderedEntityFields(entity);
  }
}

export const entitiesController = new EntitiesController(
  entitiesService,
  configurationService,
  rolesService
);
