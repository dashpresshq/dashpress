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
}

export const entitiesApiController = new EntitiesApiController(
  entitiesApiService,
  configurationApiService
);
