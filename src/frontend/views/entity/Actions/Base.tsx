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
import { IFormAction } from "shared/types/actions";
import { useApi } from "frontend/lib/data/useApi";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { ActionButtons } from "frontend/design-system/components/Button/ActionButtons";
import { DELETE_BUTTON_PROPS } from "frontend/design-system/components/Button/constants";
import { msg } from "@lingui/macro";
import { FORM_ACTION_CRUD_CONFIG } from "./constants";
import {
  LIST_ENTITY_FORM_ACTIONS,
  useCreateFormActionMutation,
  useDeleteFormActionMutation,
  useUpdateFormActionMutation,
} from "./form-actions.store";
import { ActionForm } from "./Form";

const NEW_ACTION_ITEM = "__new_action_item__";

export function FormActions({ entity }: { entity: string }) {
  const activeIntegration = useActiveIntegrations();
  const integrationsList = useIntegrationsList();

  const dataEndpoint = LIST_ENTITY_FORM_ACTIONS(entity);

  const tableData = useApi<IFormAction[]>(dataEndpoint, {
    defaultData: [],
  });

  const deleteFormActionMutation = useDeleteFormActionMutation(entity);
  const updateFormActionMutation = useUpdateFormActionMutation(entity);
  const createFormActionMutation = useCreateFormActionMutation(entity);

  const [currentFormActionId, setCurrentFormActionId] = useState("");

  const closeConfigItem = () => {
    setCurrentFormActionId("");
  };

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IFormAction>) => (
      <ActionButtons
        justIcons
        actionButtons={[
          {
            id: "edit",
            action: () => setCurrentFormActionId(row.original.id),
            label: FORM_ACTION_CRUD_CONFIG.TEXT_LANG.EDIT,
            systemIcon: "Edit",
          },
          {
            ...DELETE_BUTTON_PROPS({
              action: () =>
                deleteFormActionMutation.mutateAsync(row.original.id),
              label: FORM_ACTION_CRUD_CONFIG.TEXT_LANG.DELETE,
              isMakingRequest: false,
            }),
          },
        ]}
      />
    ),
    [deleteFormActionMutation.isPending]
  );

  const columns: IFETableColumn<IFormAction>[] = [
    {
      Header: msg`Integration`,
      accessor: "integration",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IFormAction>) => {
        return <>{userFriendlyCase(value as string)}</>;
      },
    },
    {
      Header: msg`Trigger`,
      accessor: "trigger",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IFormAction>) => {
        return <>{userFriendlyCase(value as string)}</>;
      },
    },
    {
      Header: msg`Action`,
      accessor: "action",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: IFETableCell<IFormAction>) => {
        return <>{userFriendlyCase(value as string)}</>;
      },
    },
    {
      Header: msg`Action`,
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    },
  ];

  const createNew = () => {
    setCurrentFormActionId(NEW_ACTION_ITEM);
  };

  return (
    <>
      <ViewStateMachine
        loading={activeIntegration.isLoading || integrationsList.isLoading}
        error={activeIntegration.error || integrationsList.error}
        loader={<TableSkeleton />}
      >
        <Stack $justify="end">
          <SoftButton
            action={createNew}
            systemIcon="Plus"
            label={FORM_ACTION_CRUD_CONFIG.TEXT_LANG.CREATE}
          />
        </Stack>
        <Spacer />
        <FEPaginationTable
          border
          dataEndpoint={dataEndpoint}
          columns={columns}
          empty={{
            text: FORM_ACTION_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: FORM_ACTION_CRUD_CONFIG.TEXT_LANG.CREATE,
              action: createNew,
            },
          }}
        />
      </ViewStateMachine>
      <OffCanvas
        title={
          currentFormActionId === NEW_ACTION_ITEM
            ? FORM_ACTION_CRUD_CONFIG.TEXT_LANG.CREATE
            : FORM_ACTION_CRUD_CONFIG.TEXT_LANG.EDIT
        }
        onClose={closeConfigItem}
        show={!!currentFormActionId}
      >
        <ActionForm
          onSubmit={async (data) => {
            if (currentFormActionId === NEW_ACTION_ITEM) {
              await createFormActionMutation.mutateAsync(data);
            } else {
              await updateFormActionMutation.mutateAsync(data);
            }
            closeConfigItem();
          }}
          entity={entity}
          initialValues={tableData.data.find(
            ({ id }) => id === currentFormActionId
          )}
          formAction={
            currentFormActionId === NEW_ACTION_ITEM ? "create" : "update"
          }
          integrationsList={integrationsList.data}
          activatedIntegrations={activeIntegration.data}
        />
      </OffCanvas>
    </>
  );
}
