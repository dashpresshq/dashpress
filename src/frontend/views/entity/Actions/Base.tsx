import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useIntegrationsList,
  useActiveIntegrations,
} from "frontend/views/integrations/actions/actions.store";
import { useCallback, useState } from "react";
import { IActionInstance } from "shared/types/actions";
import { useApi } from "frontend/lib/data/useApi";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "./constants";
import {
  LIST_ACTION_INSTANCES,
  useCreateActionInstanceMutation,
  useDeleteActionInstanceMutation,
  useUpdateActionInstanceMutation,
} from "./instances.store";
import { ActionForm } from "./Form";

const NEW_ACTION_ITEM = "__new_action_item__";

export function BaseActionInstances({ entity }: { entity: string }) {
  const activeIntegration = useActiveIntegrations();
  const integrationsList = useIntegrationsList();

  const dataEndpoint = LIST_ACTION_INSTANCES(entity);

  const tableData = useApi<IActionInstance[]>(dataEndpoint, {
    defaultData: [],
  });

  const deleteActionInstanceMutation = useDeleteActionInstanceMutation(entity);
  const updateActionInstanceMutation = useUpdateActionInstanceMutation();
  const createActionInstanceMutation = useCreateActionInstanceMutation();

  const [currentInstanceId, setCurrentInstanceItem] = useState("");

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
    {
      Header: "Integration",
      accessor: "integration",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IActionInstance>) => {
        return <>{userFriendlyCase(value as string)}</>;
      },
    },
    {
      Header: "Trigger",
      accessor: "trigger",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IActionInstance>) => {
        return <>{userFriendlyCase(value as string)}</>;
      },
    },
    {
      Header: "Action",
      accessor: "action",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IActionInstance>) => {
        return <>{userFriendlyCase(value as string)}</>;
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
        loading={activeIntegration.isLoading || integrationsList.isLoading}
        error={activeIntegration.error || integrationsList.error}
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
          border
          dataEndpoint={dataEndpoint}
          columns={columns}
          empty={{
            text: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.CREATE,
              action: () => setCurrentInstanceItem(NEW_ACTION_ITEM),
            },
          }}
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
          entity={entity}
          initialValues={tableData.data.find(
            ({ instanceId }) => instanceId === currentInstanceId
          )}
          formAction={
            currentInstanceId === NEW_ACTION_ITEM ? "create" : "update"
          }
          integrationsList={integrationsList.data}
          activatedIntegrations={activeIntegration.data}
        />
      </OffCanvas>
    </>
  );
}
