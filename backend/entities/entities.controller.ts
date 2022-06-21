import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { entitiesService, EntitiesService } from "./entities.service";
import { IEntityField } from "./types";
import { sortByList } from "./utils";

export class EntitiesController {
  constructor(
    private entitiesService: EntitiesService,
    private configurationService: ConfigurationService
  ) {}
  async getMenuEntities() {
    const entities = this.entitiesService.getAllEntities();
    const [hiddenEntities, entitiesOrder] = await Promise.all([
      this.configurationService.show<string[]>("entities_to_hide_from_menu"),
      this.configurationService.show<string[]>("entities_order"),
    ]);
    const entitiesToShow = entities.filter(
      ({ value }) => !hiddenEntities.includes(value)
    );

    sortByList(
      entitiesToShow.sort((a, b) => a.value.localeCompare(b.value)),
      entitiesOrder,
      "value"
    );

    return entitiesToShow;
  }

  listAllEntities() {
    return this.entitiesService.getAllEntities();
  }

  getEntityFields(entity: string): IEntityField[] {
    return this.entitiesService.getEntityFields(entity);
  }
}

export const entitiesController = new EntitiesController(
  entitiesService,
  configurationService
);
