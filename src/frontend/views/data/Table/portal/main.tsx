import { IDropDownMenuItem, ITableColumn } from "@hadmean/chromista";
import noop from "lodash/noop";

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

export function TableViewComponent() {
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
