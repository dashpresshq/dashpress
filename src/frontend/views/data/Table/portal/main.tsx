import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { DataStateKeys } from "frontend/lib/data/types";
import { ReactNode } from "react";
import { noop } from "shared/lib/noop";
import { ITableView } from "shared/types/data";

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

export const usePortalTableColumns = (entity: string) => {
  noop(entity);
  return (tableColumns: ITableColumn[]) => tableColumns;
};

export const usePortalTableTabs = (
  entity: string
): DataStateKeys<ITableView[]> => {
  noop(entity);
  return loadedDataState<ITableView[]>([]);
};

export function PortalColumnRender({
  children,
  column,
  value,
  entity,
  entityId,
}: {
  children: ReactNode;
  column: string;
  value: unknown;
  entity: string;
  entityId: string;
}) {
  noop(column, value, entity, entityId);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
