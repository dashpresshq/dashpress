import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";

export { sortListByOrder } from "./utils";

export class ListOrderApiService implements IApplicationService {
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

    await this._listOrderPersistenceService.updateItem(listId, [
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
}

const listOrderPersistenceService =
  createConfigDomainPersistenceService<string[]>("list-order");

export const listOrderApiService = new ListOrderApiService(
  listOrderPersistenceService
);
