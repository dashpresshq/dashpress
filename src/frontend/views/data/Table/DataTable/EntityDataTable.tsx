import { TableSkeleton } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ENTITY_TABLE_PATH } from "../../../../hooks/data/data.store";
import { useTableColumns } from "../useTableColumns";
import { TableViewComponent } from "../portal";
import { IDataTableProps } from "../types";
import { BaseDataTable } from ".";

interface IProps extends IDataTableProps {
  entity: string;
  tabKey?: string;
}

export function EntityDataTable({
  entity,
  lean,
  tabKey = "",
  ...props
}: IProps) {
  const columns = useTableColumns(entity, lean);

  const { error } = columns;

  const isLoading = entity === SLUG_LOADING_VALUE || columns.isLoading;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton lean={lean} />}
      >
        {!isLoading && (
          <BaseDataTable
            dataEndpoint={ENTITY_TABLE_PATH(entity)}
            columns={columns.data || []}
            enabled={entity && entity !== SLUG_LOADING_VALUE}
            stateStorageKey={`${entity}${tabKey}${lean ? "--lean" : ""}`}
            lean={lean}
            {...props}
          />
        )}
      </ViewStateMachine>
      <TableViewComponent />
    </>
  );
}
