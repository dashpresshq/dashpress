import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useApi } from "frontend/lib/data/useApi";
import {
  useActiveIntegrations,
  useIntegrationsList,
} from "frontend/views/integrations/actions/actions.store";
import { useCallback, useState } from "react";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import type { IFormAction } from "shared/types/actions";

import { ActionButtons } from "@/components/app/button/action";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { SoftButton } from "@/components/app/button/soft";
import { OffCanvas } from "@/components/app/off-canvas";
import type {
  IFETableCell,
  IFETableColumn,
} from "@/components/app/pagination-table";
import { FEPaginationTable } from "@/components/app/pagination-table";
import { TableSkeleton } from "@/components/app/skeleton/table";
import { ViewStateMachine } from "@/components/app/view-state-machine";

import { ActionForm } from "./Form";
import {
  LIST_ENTITY_FORM_ACTIONS,
  useCreateFormActionMutation,
  useDeleteFormActionMutation,
  useUpdateFormActionMutation,
} from "./form-actions.store";

const NEW_ACTION_ITEM = "__new_action_item__";

export function FormActions({ entity }: { entity: string }) {
  const activeIntegration = useActiveIntegrations();
  const integrationsList = useIntegrationsList();
  const domainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FORM_ACTIONS
  );
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
        size="icon"
        actionButtons={[
          {
            id: "edit",
            action: () => setCurrentFormActionId(row.original.id),
            label: domainMessages.TEXT_LANG.EDIT,
            systemIcon: "Edit",
          },
          {
            ...DELETE_BUTTON_PROPS({
              action: () =>
                deleteFormActionMutation.mutateAsync(row.original.id),
              label: domainMessages.TEXT_LANG.DELETE,
              isMakingRequest: false,
            }),
          },
        ]}
      />
    ),
    [
      deleteFormActionMutation,
      domainMessages.TEXT_LANG.DELETE,
      domainMessages.TEXT_LANG.EDIT,
    ]
  );

  const columns: IFETableColumn<IFormAction>[] = [
    {
      Header: msg`Integration`,
      accessor: "integration",
      filter: {
        _type: "string",
        bag: undefined,
      },
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
        <div className="mb-3 flex justify-end">
          <SoftButton
            action={createNew}
            systemIcon="Plus"
            label={domainMessages.TEXT_LANG.CREATE}
          />
        </div>
        <FEPaginationTable
          border
          dataEndpoint={dataEndpoint}
          columns={columns}
          empty={{
            text: domainMessages.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: domainMessages.TEXT_LANG.CREATE,
              action: createNew,
            },
          }}
        />
      </ViewStateMachine>
      <OffCanvas
        title={
          currentFormActionId === NEW_ACTION_ITEM
            ? domainMessages.TEXT_LANG.CREATE
            : domainMessages.TEXT_LANG.EDIT
        }
        size="sm"
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
