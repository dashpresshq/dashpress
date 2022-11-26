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
  SLUG_LOADING_VALUE,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { useCallback, useState } from "react";
import { IActionInstance } from "shared/types/actions";
import {
  LIST_ACTION_INSTANCES,
  //   useCreateActionInstanceMutation,
  useDeleteActionInstanceMutation,
  //   useUpdateActionInstanceMutation,
} from "./instances.store";

interface IProps {
  entity?: string;
  integrationKey?: string;
}

const NEW_ACTION_ITEM = "__new_action_item__";

export function BaseActionInstances({ entity, integrationKey }: IProps) {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IActionInstance> | IBEPaginatedDataState
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  const tableData = useFEPaginatedData<Record<string, unknown>>(
    LIST_ACTION_INSTANCES({ entity, integrationKey }),
    {
      ...paginatedDataState,
      sortBy: undefined,
      pageIndex: 1,
      filters: undefined,
    }
  );

  const deleteActionInstanceMutation = useDeleteActionInstanceMutation();
  //   const updateActionInstanceMutation = useUpdateActionInstanceMutation();
  //   const createActionInstanceMutation = useCreateActionInstanceMutation();

  const [currentInstanceId, setCurrentInstanceItem] = useState("");

  const closeConfigItem = () => {
    setCurrentInstanceItem("");
  };

  const MemoizedAction = useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={() =>
            setCurrentInstanceItem((row.original as IActionInstance).instanceId)
          }
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            deleteActionInstanceMutation.mutateAsync(
              (row.original as IActionInstance).instanceId
            )
          }
          isMakingDeleteRequest={deleteActionInstanceMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [deleteActionInstanceMutation.isLoading]
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
          currentInstanceId === NEW_ACTION_ITEM ? `New Action` : `Edit Action`
        }
        onClose={closeConfigItem}
        show={!!currentInstanceId}
      >
        {/* <KeyValueForm
          initialValues={(tableData?.data?.data || []).find(
            ({ key }) => key === currentInstanceId
          )}
          onSubmit={async (values: { key: string; value: string }) => {
            await upsertConfigurationMutation.mutateAsync(values);
            closeConfigItem();
          }}
        /> */}
      </OffCanvas>
    </>
  );
}
