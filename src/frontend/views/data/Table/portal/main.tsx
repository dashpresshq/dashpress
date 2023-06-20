import { IDropDownMenuItem, ITableColumn } from "@hadmean/chromista";
import { DataStateKeys } from "@hadmean/protozoa";
import noop from "lodash/noop";
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
  return {
    data: [],
    error: null,
    isLoading: false,
    isRefetching: false,
  };
};
