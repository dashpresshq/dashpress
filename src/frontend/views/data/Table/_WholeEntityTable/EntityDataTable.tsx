import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { ENTITY_TABLE_PATH } from "frontend/hooks/data/constants";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { TableSkeleton } from "@/components/app/skeleton/table";
import { Card } from "@/components/ui/card";
import { useTableColumns } from "../useTableColumns";
import { TableViewComponent } from "../portal";
import type { IDataTableProps } from "../types";
import { BaseDataTable } from "../DataTable";
import { useCanUserPerformCrudAction } from "../../hooks/useCanUserPerformCrudAction";

interface IProps extends IDataTableProps {
  entity: string;
  createNewLink: string;
  tabKey?: string;
}

export function EntityDataTable({
  entity,
  createNewLink,
  tabKey = "",
  ...props
}: IProps) {
  const columns = useTableColumns(entity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  const entityCrudConfig = useEntityCrudConfig(entity);

  const { error } = columns;

  const { isLoading } = columns;

  return (
    <Card>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton />}
      >
        {!isLoading && (
          <BaseDataTable
            dataEndpoint={ENTITY_TABLE_PATH(entity)}
            columns={columns.data || []}
            stateStorageKey={`${entity}${tabKey}`}
            empty={{
              text: entityCrudConfig.TEXT_LANG.EMPTY_LIST,
              createNew: canUserPerformCrudAction("create")
                ? {
                    label: entityCrudConfig.TEXT_LANG.CREATE,
                    action: createNewLink,
                  }
                : undefined,
            }}
            {...props}
          />
        )}
      </ViewStateMachine>
      <TableViewComponent entity={entity} />
    </Card>
  );
}
