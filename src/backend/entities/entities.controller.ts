import { IValueLabel } from "@hadmean/chromista/dist/types";
import { IEntityField, IEntityRelation } from "shared/types";
import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { entitiesService, EntitiesService } from "./entities.service";
import { sortByList } from "./utils";

export class EntitiesController {
  constructor(
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService
  ) {}

  async getMenuEntities(): Promise<IValueLabel[]> {
    const [hiddenEntities, entitiesOrder, entities] = await Promise.all([
      this._configurationService.show<string[]>("disabled_entities"),
      this._configurationService.show<string[]>("entities_order"),
      this._entitiesService.getAllEntities(),
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

  async getEntityRelations(entity: string): Promise<IEntityRelation[]> {
    const [
      entityRelations,
      disabledEntities,
      entityLabels,
      entityOrders,
      hiddenEntity,
    ] = await Promise.all([
      this._entitiesService.getEntityRelations(entity),
      this._configurationService.show<string[]>("disabled_entities"),
      this._configurationService.show<Record<string, string>>(
        "entity_relations_labels",
        entity
      ),
      this._configurationService.show<string[]>(
        "entity_relations_order",
        entity
      ),
      this._configurationService.show<string[]>(
        "hidden_entity_relations",
        entity
      ),
    ]);

    const allowedEntityRelation = entityRelations.filter(
      ({ table }) =>
        !disabledEntities.includes(table) && !hiddenEntity.includes(table)
    );

    sortByList(
      allowedEntityRelation as unknown[] as Record<string, unknown>[],
      entityOrders,
      "table"
    );

    return allowedEntityRelation.map((relation) => {
      const type = relation?.joinColumnOptions?.[0].name ? "toOne" : "toMany";

      return {
        table: relation.table,
        label: entityLabels[relation.table],
        type,
        field:
          type === "toOne" ? relation?.joinColumnOptions?.[0].name : undefined,
      };
    });
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    const [entityFields, entityFieldsOrder] = await Promise.all([
      this._entitiesService.getEntityFields(entity),
      this._configurationService.show<string[]>("entity_fields_orders", entity),
    ]);

    sortByList(
      entityFields as unknown as Record<string, unknown>[],
      entityFieldsOrder,
      "name" as keyof IEntityField
    );

    return entityFields;
  }
}

export const entitiesController = new EntitiesController(
  entitiesService,
  configurationService
);
