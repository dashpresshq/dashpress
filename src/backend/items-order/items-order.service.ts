import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";

export class ItemsOrderService implements IApplicationService {
  constructor(
    private readonly _itemsOrderPersistenceService: AbstractConfigDataPersistenceService<
      string[]
    >
  ) {}

  async bootstrap() {
    await this._itemsOrderPersistenceService.setup();
  }

  async getItemOrder(itemId: string): Promise<string[]> {
    return await this._itemsOrderPersistenceService.getItem(itemId);
  }

  async appendToList(itemId: string, newId: string): Promise<void> {
    const itemsOrder = await this.getItemOrder(itemId);

    await this._itemsOrderPersistenceService.upsertItem(itemId, [
      ...itemsOrder,
      newId,
    ]);
  }

  async upsertOrder(itemId: string, newOrder: string[]): Promise<void> {
    await this._itemsOrderPersistenceService.upsertItem(itemId, newOrder);
  }

  async removeFromList(itemId: string, toRemoveId: string): Promise<void> {
    const widgetList = await this.getItemOrder(itemId);

    const newWidgetList = widgetList.filter(
      (widgetId$1) => widgetId$1 !== toRemoveId
    );

    await this.upsertOrder(itemId, newWidgetList);
  }

  sortByOrder<T extends { id: string }>(order: string[], items: T[]): T[] {
    const itemsMap = Object.fromEntries(items.map((item) => [item.id, item]));

    return order.map((item) => itemsMap[item]);
  }
}

const itemsOrderPersistenceService =
  createConfigDomainPersistenceService<string[]>("items-order");

export const itemsOrderService = new ItemsOrderService(
  itemsOrderPersistenceService
);
