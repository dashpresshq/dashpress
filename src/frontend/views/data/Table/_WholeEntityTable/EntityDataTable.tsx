import { TableSkeleton } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { ENTITY_TABLE_PATH } from "../../../../hooks/data/data.store";
import { useTableColumns } from "../useTableColumns";
import { TableViewComponent } from "../portal";
import { IDataTableProps } from "../types";
import { BaseDataTable } from "../DataTable";

interface IProps extends IDataTableProps {
  entity: string;
  tabKey?: string;
}

export function EntityDataTable({ entity, tabKey = "", ...props }: IProps) {
  const columns = useTableColumns(entity);

  const entityCrudConfig = useEntityCrudConfig(entity);

  const { error } = columns;

  const isLoading = entity === SLUG_LOADING_VALUE || columns.isLoading;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton />}
      >
        {!isLoading && (
          <BaseDataTable
            dataEndpoint={ENTITY_TABLE_PATH(entity)}
            columns={columns.data || []}
            enabled={entity && entity !== SLUG_LOADING_VALUE}
            stateStorageKey={`${entity}${tabKey}`}
            crudConfig={entityCrudConfig}
            {...props}
          />
        )}
      </ViewStateMachine>
      <TableViewComponent entity={entity} />
    </>
  );
}
