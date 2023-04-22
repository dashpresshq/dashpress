import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { EntityDataTable } from "frontend/views/data/Table/DataTable/EntityDataTable";
import { ITableTab } from "shared/types/data";
import { ITableWidgetConfig } from "shared/types/dashboard";
import { IWidgetProps } from "../types";

export function TableWidget({ config }: IWidgetProps<ITableWidgetConfig>) {
  const { queryId, entity } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    config.entity
  );
  const dataState = (entityViews.data || []).find(
    ({ id }) => id === queryId
  )?.dataState;

  return (
    <EntityDataTable
      entity={entityViews.isLoading ? SLUG_LOADING_VALUE : entity}
      defaultTableState={{ ...dataState, pageSize: config.limit || 5 }}
      lean
      border
    />
  );
}
