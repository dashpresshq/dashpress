import {
  DeleteButton,
  ErrorAlert,
  OffCanvas,
  SoftButton,
  Spacer,
  Stack,
  Text,
  TableSkeleton,
} from "@hadmean/chromista";
import { SLUG_LOADING_VALUE, useApi } from "@hadmean/protozoa";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { FEPaginationTable } from "frontend/components/FEPaginationTable";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "frontend/views/actions/actions.store";
import { INTEGRATIONS_GROUP_CONFIG } from "frontend/views/settings/Variables/constants";
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
          dataEndpoint={dataEndpoint}
          columns={[
            integrationKey
              ? {
                  Header: "Entity",
                  accessor: "entity",
                  filter: {
                    _type: "string",
                  },
                }
              : {
                  Header: "Integration",
                  accessor: "integrationKey",
                  filter: {
                    _type: "string",
                  },
                },
            {
              Header: "Trigger",
              accessor: "formAction",
              filter: {
                _type: "string",
              },
            },
            {
              Header: "Action",
              accessor: "implementationKey",
              filter: {
                _type: "string",
              },
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
          currentInstanceId === NEW_ACTION_ITEM
            ? `New Form Action`
            : `Edit Form Action`
        }
        onClose={closeConfigItem}
        show={!!currentInstanceId}
      >
        <Text textStyle="italic" size="5">
          Use your {`{{`}
          {INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.ENTRY{`}}`} and {`{{`}
          {INTEGRATIONS_GROUP_CONFIG.constants.prefix}.ENTRY
          {`}}`} here.
        </Text>
        <Spacer />
        <Text textStyle="italic" size="5">
          {" "}
          Access the current data with {`{{`}
          data.anyValidEntityField
          {`}}`}
        </Text>
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
