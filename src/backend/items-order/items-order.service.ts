import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";

export class ListOrderService implements IApplicationService {
  constructor(
    private readonly _listOrderPersistenceService: AbstractConfigDataPersistenceService<
      string[]
    >
  ) {}

  async bootstrap() {
    await this._listOrderPersistenceService.setup();
  }

  async getItemOrder(listId: string): Promise<string[]> {
    return (await this._listOrderPersistenceService.getItem(listId)) || [];
  }

  async appendToList(listId: string, itemId: string): Promise<void> {
    const listsOrder = await this.getItemOrder(listId);

    await this._listOrderPersistenceService.upsertItem(listId, [
      ...listsOrder,
      itemId,
    ]);
  }

  async upsertOrder(listId: string, listOrder: string[]): Promise<void> {
    await this._listOrderPersistenceService.upsertItem(listId, listOrder);
  }

  async removeFromList(listId: string, toRemoveId: string): Promise<void> {
    const listOrder = await this.getItemOrder(listId);

    const newListOrder = listOrder.filter(
      (widgetId$1) => widgetId$1 !== toRemoveId
    );

    await this.upsertOrder(listId, newListOrder);
  }

  sortByOrder<T extends { id: string }>(
    order: string[],
    itemListOrder: T[]
  ): T[] {
    const itemsMap = Object.fromEntries(
      itemListOrder.map((item) => [item.id, item])
    );

    return order.map((item) => itemsMap[item]);
  }
}

const listOrderPersistenceService =
  createConfigDomainPersistenceService<string[]>("list-order");

export const listOrderService = new ListOrderService(
  listOrderPersistenceService
);
