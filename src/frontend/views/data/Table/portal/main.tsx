import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { DataStateKeys } from "frontend/lib/data/types";
import { noop } from "shared/lib/noop";
import { ITableTab } from "shared/types/data";

export const usePluginTableMenuItems = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
): IDropDownMenuItem[] => {
  const menuItems: IDropDownMenuItem[] = [];
  noop(entity, reference);
  return menuItems;
};

export const useSyncPaginatedDataState = () => {};

export function TableViewComponent({ entity }: { entity: string }) {
  noop(entity);
  return <span />;
}

export function TableTopComponent({ entity }: { entity: string }) {
  noop(entity);
  return <span />;
}

export const usePortalTableColumns = (entity: string, lean: boolean) => {
  noop(entity, lean);
  return (tableColumns: ITableColumn[]) => tableColumns;
};

export const usePortalTableTabs = (
  entity: string
): DataStateKeys<ITableTab[]> => {
  noop(entity);
  return loadedDataState<ITableTab[]>([]);
};
