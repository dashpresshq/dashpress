import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import type { DataStateKeys } from "frontend/lib/data/types";
import type { ReactNode } from "react";
import { noop } from "shared/lib/noop";
import type { ITableView } from "shared/types/data";

import type { IMenuActionItem } from "@/components/app/button/types";
import type { ITableColumn } from "@/components/app/table/types";

export const usePluginTableMenuItems = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
): IMenuActionItem[] => {
  const menuItems: IMenuActionItem[] = [];
  noop(entity, reference);
  return menuItems;
};

export const useSyncPaginatedDataState = () => {};

export function TableViewComponent({ entity }: { entity: string }) {
  noop(entity);
  return null;
}

export function TableTopComponent({ entity }: { entity: string }) {
  noop(entity);
  return null;
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
