import {
  DeleteButton,
  ErrorAlert,
  OffCanvas,
  SoftButton,
  Spacer,
  Stack,
  TableSkeleton,
  Typo,
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
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { useCallback, useState } from "react";
import { IActionInstance } from "shared/types/actions";
import { ActionForm } from "./Form";
import {
  LIST_ACTION_INSTANCES,
  useCreateActionInstanceMutation,
  useDeleteActionInstanceMutation,
  useUpdateActionInstanceMutation,
} from "./instances.store";

interface IProps {
  entity?: string;
  integrationKey?: string;
}

const NEW_ACTION_ITEM = "__new_action_item__";

export function BaseActionInstances({ entity, integrationKey }: IProps) {
  const activeActionList = useActiveActionList();
  const integrationsList = useActionIntegrationsList();
  const activeEntities = useActiveEntities();

  const dataEndpoint = LIST_ACTION_INSTANCES({ entity, integrationKey });

  const tableData = useApi<IActionInstance[]>(dataEndpoint);

  const deleteActionInstanceMutation = useDeleteActionInstanceMutation();
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
    integrationKey
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

  if (!entity && !integrationKey) {
    return <ErrorAlert message="Pass in either of entity or the integration" />;
  }

  return (
    <>
      <ViewStateMachine
        loading={
          entity === SLUG_LOADING_VALUE ||
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
            label="Add New Form Integration"
          />
        </Stack>
        <Spacer />
        <FEPaginationTable
          emptyMessage={`No Form Integration Has Been Registered For This ${
            entity ? "Entity" : "Action"
          }`}
          border
          dataEndpoint={dataEndpoint}
          columns={columns}
        />
      </ViewStateMachine>
      <OffCanvas
        title={
          currentInstanceId === NEW_ACTION_ITEM
            ? `New Form Action`
            : `Edit Form Action`
        }
        onClose={closeConfigItem}
        show={!!currentInstanceId}
      >
        <Typo.SM textStyle="italic">
          Use your {`{{`} {INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.ENTRY{" "}
          {`}}`} and {`{{`} {INTEGRATIONS_GROUP_CONFIG.constants.prefix}.ENTRY{" "}
          {`}}`} here.
        </Typo.SM>
        <Spacer />
        <Typo.SM textStyle="italic">
          {" "}
          Access the current data with {`{{`} data.anyValidEntityField {`}}`}
        </Typo.SM>
        <Spacer />

        <Typo.SM textStyle="italic">
          {" "}
          Access the current user properties with any of {`{{`} auth.role {`}}`}
          , {`{{`} auth.name {`}}`}, {`{{`} auth.username {`}}`} and {`{{`}{" "}
          auth.systemProfile {`}}`}
        </Typo.SM>

        <Spacer />

        <ActionForm
          onSubmit={async (data) => {
            if (currentInstanceId === NEW_ACTION_ITEM) {
              await createActionInstanceMutation.mutateAsync(data);
            } else {
              await updateActionInstanceMutation.mutateAsync(data);
            }
            closeConfigItem();
          }}
          currentView={{ entity, integrationKey }}
          initialValues={(tableData?.data || []).find(
            ({ instanceId }) => instanceId === currentInstanceId
          )}
          formAction={
            currentInstanceId === NEW_ACTION_ITEM ? "create" : "update"
          }
          integrationsList={integrationsList.data || []}
          activatedActions={activeActionList.data || []}
          entities={activeEntities.data || []}
        />
      </OffCanvas>
    </>
  );
}
