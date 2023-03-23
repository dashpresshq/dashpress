import { IDropDownMenuItem, ITableColumn } from "@hadmean/chromista";
import noop from "lodash/noop";

export const usePluginTableMenuItems = (): IDropDownMenuItem[] => {
  const menuItems: IDropDownMenuItem[] = [];

  return menuItems;
};

export const useSyncPaginatedDataState = () => {};

export function TableViewComponent() {
  return <span />;
}

export const usePortalTableColumns = (entity: string, lean: boolean) => {
  noop(entity, lean);
  return (tableColumns: ITableColumn[]) => tableColumns;
};
