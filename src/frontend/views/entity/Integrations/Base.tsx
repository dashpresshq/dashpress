import {
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  OffCanvas,
  SoftButton,
  Stack,
  Table,
  TableSkeleton,
} from "@hadmean/chromista";
import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { useCallback, useState } from "react";
import { IActionsToTrigger } from "shared/types/actions";

interface IProps {
  entity?: string;
  integrationKey?: string;
}

const NEW_ACTION_ITEM = "__new_action_item__";

export function BaseActionInstances({ entity, integrationKey }: IProps) {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IActionsToTrigger> | IBEPaginatedDataState
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  const tableData = useFEPaginatedData<Record<string, unknown>>(
    INTEGRATIONS_GROUP_ENDPOINT(group),
    {
      ...paginatedDataState,
      sortBy: undefined,
      pageIndex: 1,
      filters: undefined,
    }
  );

  const [currentConfigItem, setCurrentConfigItem] = useState("");

  const closeConfigItem = () => {
    setCurrentConfigItem("");
  };

  const MemoizedAction = useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={() => setCurrentConfigItem((row.original as IKeyValue).key)}
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            deleteConfigurationMutation.mutateAsync(
              (row.original as IKeyValue).key
            )
          }
          isMakingDeleteRequest={deleteConfigurationMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [deleteConfigurationMutation.isLoading]
  );

  return (
    <>
      <ViewStateMachine
        loading={entity === SLUG_LOADING_VALUE}
        error={false}
        loader={<TableSkeleton />}
      >
        <Table
          {...{
            tableData,
            setPaginatedDataState,
            paginatedDataState,
          }}
          // TODO emptyMessage="No ${INTEGRATIONS_GROUP_LABEL[group].label}"
          columns={[
            {
              Header: "Entity",
              accessor: "entity",
              disableSortBy: true,
            },
            {
              Header: "Integration Key",
              accessor: "entity",
              disableSortBy: true,
            },
            {
              Header: "Action",
              accessor: "action",
              disableSortBy: true,
            },
            {
              Header: "Perform Key",
              accessor: "performKey",
              disableSortBy: true,
            },
            {
              Header: "Action",
              Cell: MemoizedAction,
            },
          ]}
        />
      </ViewStateMachine>
      <OffCanvas
        title={
          currentConfigItem === NEW_ACTION_ITEM ? `New Action` : `Edit Action`
        }
        onClose={closeConfigItem}
        show={!!currentConfigItem}
      >
        <KeyValueForm
          initialValues={(tableData?.data?.data || []).find(
            ({ key }) => key === currentConfigItem
          )}
          onSubmit={async (values: { key: string; value: string }) => {
            await upsertConfigurationMutation.mutateAsync(values);
            closeConfigItem();
          }}
        />
      </OffCanvas>
    </>
  );
}
