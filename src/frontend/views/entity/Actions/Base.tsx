import {
  DeleteButton,
  OffCanvas,
  SoftButton,
  Spacer,
  Stack,
  TableSkeleton,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE, useApi } from "@hadmean/protozoa";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "frontend/views/integrations/actions/actions.store";
import { useCallback, useState } from "react";
import { IActionInstance } from "shared/types/actions";
import { ActionForm } from "./Form";
import {
  LIST_ACTION_INSTANCES,
  useCreateActionInstanceMutation,
  useDeleteActionInstanceMutation,
  useUpdateActionInstanceMutation,
} from "./instances.store";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "./constants";
import { ActionInstanceView } from "./types";

const NEW_ACTION_ITEM = "__new_action_item__";

export function BaseActionInstances(actionInstanceView: ActionInstanceView) {
  const activeActionList = useActiveActionList();
  const integrationsList = useActionIntegrationsList();
  const activeEntities = useActiveEntities();

  const dataEndpoint = LIST_ACTION_INSTANCES(actionInstanceView);

  const tableData = useApi<IActionInstance[]>(dataEndpoint, {
    defaultData: [],
  });

  const deleteActionInstanceMutation =
    useDeleteActionInstanceMutation(actionInstanceView);
  const updateActionInstanceMutation = useUpdateActionInstanceMutation();
  const createActionInstanceMutation = useCreateActionInstanceMutation();

  const [currentInstanceId, setCurrentInstanceItem] = useState("");

  const { id: actionInstanceViewId, type: actionInstanceViewType } =
    actionInstanceView;

  const closeConfigItem = () => {
    setCurrentInstanceItem("");
  };

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IActionInstance>) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={() => setCurrentInstanceItem(row.original.instanceId)}
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            deleteActionInstanceMutation.mutateAsync(row.original.instanceId)
          }
          isMakingDeleteRequest={false}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [deleteActionInstanceMutation.isLoading]
  );

  const columns: IFETableColumn<IActionInstance>[] = [
    actionInstanceViewType === "integrationKey"
      ? {
          Header: "Entity",
          accessor: "entity",
          filter: {
            _type: "string",
            bag: undefined,
          },
        }
      : {
          Header: "Integration",
          accessor: "integrationKey",
          filter: {
            _type: "string",
            bag: undefined,
          },
        },
    {
      Header: "Trigger",
      accessor: "formAction",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: "Action",
      accessor: "implementationKey",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: "Action",
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    },
  ];

  return (
    <>
      <ViewStateMachine
        loading={
          actionInstanceViewId === SLUG_LOADING_VALUE ||
          activeActionList.isLoading ||
          activeEntities.isLoading ||
          integrationsList.isLoading
        }
        error={
          activeActionList.error ||
          activeEntities.error ||
          integrationsList.error
        }
        loader={<TableSkeleton />}
      >
        <Stack justify="end">
          <SoftButton
            action={() => setCurrentInstanceItem(NEW_ACTION_ITEM)}
            icon="add"
            label={ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.CREATE}
          />
        </Stack>
        <Spacer />
        <FEPaginationTable
          emptyMessage={ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST}
          border
          dataEndpoint={dataEndpoint}
          columns={columns}
        />
      </ViewStateMachine>
      <OffCanvas
        title={
          currentInstanceId === NEW_ACTION_ITEM
            ? ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.CREATE
            : ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.EDIT
        }
        onClose={closeConfigItem}
        show={!!currentInstanceId}
      >
        <ActionForm
          onSubmit={async (data) => {
            if (currentInstanceId === NEW_ACTION_ITEM) {
              await createActionInstanceMutation.mutateAsync(data);
            } else {
              await updateActionInstanceMutation.mutateAsync(data);
            }
            closeConfigItem();
          }}
          currentView={actionInstanceView}
          initialValues={tableData.data.find(
            ({ instanceId }) => instanceId === currentInstanceId
          )}
          formAction={
            currentInstanceId === NEW_ACTION_ITEM ? "create" : "update"
          }
          integrationsList={integrationsList.data}
          activatedActions={activeActionList.data}
          entities={activeEntities.data}
        />
      </OffCanvas>
    </>
  );
}
