import type { AbstractConfigDataPersistenceService } from "@/backend/lib/config-persistence";
import { createConfigDomainPersistenceService } from "@/backend/lib/config-persistence";

export class ListOrderApiService {
  constructor(
    private readonly _listOrderPersistenceService: AbstractConfigDataPersistenceService<
      string[]
    >
  ) {}

  async getItemOrder(listId: string): Promise<string[]> {
    return await this._listOrderPersistenceService.getItem(listId, []);
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

  async removeList(listId: string): Promise<void> {
    await this._listOrderPersistenceService.removeItem(listId);
  }
}

const listOrderPersistenceService =
  createConfigDomainPersistenceService<string[]>("list-order");

export const listOrderApiService = new ListOrderApiService(
  listOrderPersistenceService
);
