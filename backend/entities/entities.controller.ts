import { IValueLabel } from '@gothicgeeks/design-system/dist/types';
import { ConfigurationService, configurationService } from '../configuration/configuration.service';
import { entitiesService, EntitiesService } from './entities.service';
import { IEntityField } from './types';
import { sortByList } from './utils';

export class EntitiesController {
  constructor(
    private _entitiesService: EntitiesService,
    private _configurationService: ConfigurationService,
  ) {}

  async getMenuEntities(): Promise<IValueLabel[]> {
    const entities = this._entitiesService.getAllEntities();
    const [hiddenEntities, entitiesOrder] = await Promise.all([
      this._configurationService.show<string[]>('entities_to_hide_from_menu'),
      this._configurationService.show<string[]>('entities_order'),
    ]);
    const entitiesToShow = entities.filter(({ value }) => !hiddenEntities.includes(value));

    sortByList(
      entitiesToShow.sort((a, b) => a.value.localeCompare(b.value)),
      entitiesOrder,
      'value',
    );

    return entitiesToShow;
  }

  listAllEntities() {
    return this._entitiesService.getAllEntities();
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    const [entityFields, entityFieldsOrder] = await Promise.all([
      this._entitiesService.getEntityFields(entity),
      this._configurationService.show<string[]>('entity_fields_orders', entity),
    ]);

    sortByList(
      entityFields as unknown as Record<string, unknown>[],
      entityFieldsOrder,
      'name' as keyof IEntityField,
    );

    return entityFields;
  }
}

export const entitiesController = new EntitiesController(entitiesService, configurationService);
