import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { useCallback, useMemo, useState } from "react";
import type { IPageDetails } from "frontend/lib/routing/usePageDetails";
import { useSetCurrentActionItems } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { VariablesDocumentation } from "frontend/docs/variables";
import { useApi } from "frontend/lib/data/useApi";
import {
  PasswordMessage,
  PasswordToReveal,
} from "frontend/views/integrations/Password";
import type { IKeyValue } from "shared/types/options";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import type {
  IFETableCell,
  IFETableColumn,
} from "@/components/app/pagination-table";
import { FEPaginationTable } from "@/components/app/pagination-table";
import { Card } from "@/components/ui/card";
import { OffCanvas } from "@/components/app/off-canvas";
import { ActionButtons } from "@/components/app/button/action";
import { useToastActionQueryError } from "@/components/app/toast/error";
import { INTEGRATIONS_GROUP_CRUD_CONFIG } from "./constants";
import { KeyValueForm } from "./Form";
import {
  INTEGRATIONS_GROUP_ENDPOINT,
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpsertationMutation,
  useRevealedCredentialsList,
} from "./configurations.store";

const NEW_CONFIG_ITEM = "__new_config_item__";

export function ManageCredentialGroup({
  group,
  currentTab,
}: {
  group: IntegrationsConfigurationGroup;
  currentTab: IntegrationsConfigurationGroup;
}) {
  const dataEndpoint = INTEGRATIONS_GROUP_ENDPOINT(group);
  const upsertConfigurationMutation =
    useIntegrationConfigurationUpsertationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);
  const tableData = useApi<IKeyValue[]>(dataEndpoint, { defaultData: [] });

  const revealedCredentials = useRevealedCredentialsList(group);

  useToastActionQueryError(
    revealedCredentials.error,
    group === IntegrationsConfigurationGroup.Credentials
  );

  const userHasPermission = useUserHasPermission();

  const [currentConfigItem, setCurrentConfigItem] = useState("");

  const closeConfigItem = () => {
    setCurrentConfigItem("");
  };

  const domainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG[group].domainDiction
  );

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IKeyValue>) => (
      <ActionButtons
        size="icon"
        actionButtons={[
          {
            id: "edit",
            action: () => setCurrentConfigItem(row.original.key),
            label: domainMessages.TEXT_LANG.EDIT,
            systemIcon: "Edit",
          },
          {
            ...DELETE_BUTTON_PROPS({
              action: () =>
                deleteConfigurationMutation.mutateAsync(row.original.key),
              label: domainMessages.TEXT_LANG.DELETE,
              isMakingRequest: false,
            }),
          },
        ]}
      />
    ),
    [
      deleteConfigurationMutation,
      domainMessages.TEXT_LANG.DELETE,
      domainMessages.TEXT_LANG.EDIT,
    ]
  );

  const canManageAction = !(
    group === IntegrationsConfigurationGroup.Credentials &&
    !userHasPermission(UserPermissions.CAN_MANAGE_APP_CREDENTIALS)
  );

  const showManageAction =
    canManageAction &&
    (group !== IntegrationsConfigurationGroup.Credentials ||
      (group === IntegrationsConfigurationGroup.Credentials &&
        revealedCredentials.data !== undefined));

  const actionItems:
    | Pick<IPageDetails, "actionItems" | "secondaryActionItems">
    | undefined = useMemo(() => {
    if (group !== currentTab) {
      return undefined;
    }

    return {
      actionItems: showManageAction
        ? [
            {
              id: `add-${showManageAction ? "true" : "false"}`,
              action: () => {
                setCurrentConfigItem(NEW_CONFIG_ITEM);
              },
              systemIcon: "Plus",
              label: domainMessages.TEXT_LANG.CREATE,
            },
          ]
        : [],
      secondaryActionItems: [documentationActionButton],
    };
  }, [
    group,
    currentTab,
    showManageAction,
    domainMessages.TEXT_LANG.CREATE,
    documentationActionButton,
  ]);

  useSetCurrentActionItems(actionItems);

  const tableColumns: IFETableColumn<IKeyValue>[] = [
    {
      Header: msg`Key`,
      accessor: "key",
      filter: {
        _type: "string",
        bag: undefined,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      Cell: ({ value }: { value: unknown }) => (
        <span
          dangerouslySetInnerHTML={{
            __html: `{{ ${INTEGRATIONS_GROUP_CONFIG[group].prefix}.${value} }}`,
          }}
        />
      ),
    },
    {
      Header: msg`Value`,
      accessor: "value",
    },
  ];
  if (showManageAction) {
    tableColumns.push({
      Header: msg`Action`,
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    });
  }

  return (
    <Card>
      <section aria-label={`${group} priviledge section`}>
        {group === IntegrationsConfigurationGroup.Credentials &&
          userHasPermission(UserPermissions.CAN_MANAGE_APP_CREDENTIALS) &&
          revealedCredentials.data === undefined && (
            <div className="my-3 px-3">
              <PasswordToReveal isLoading={revealedCredentials.isLoading} />
            </div>
          )}
        {!canManageAction && tableData.data.length > 0 && (
          <p className="my-2 px-2 text-sm italic">
            Your account does not have the permission to view secret values or
            manage them
          </p>
        )}
      </section>

      <FEPaginationTable
        dataEndpoint={dataEndpoint}
        empty={{
          text: domainMessages.TEXT_LANG.EMPTY_LIST,
          createNew: showManageAction
            ? {
                label: domainMessages.TEXT_LANG.CREATE,
                action: () => setCurrentConfigItem(NEW_CONFIG_ITEM),
              }
            : undefined,
        }}
        columns={tableColumns}
      />

      <OffCanvas
        title={
          currentConfigItem === NEW_CONFIG_ITEM
            ? domainMessages.TEXT_LANG.CREATE
            : domainMessages.TEXT_LANG.EDIT
        }
        onClose={closeConfigItem}
        size="sm"
        show={!!currentConfigItem}
      >
        {group === IntegrationsConfigurationGroup.Credentials && (
          <div className="mb-3">
            <PasswordMessage />
          </div>
        )}
        <div className="px-1">
          <KeyValueForm
            group={group}
            initialValues={tableData.data.find(
              ({ key }) => key === currentConfigItem
            )}
            onSubmit={async (values: { key: string; value: string }) => {
              await upsertConfigurationMutation.mutateAsync(values);
              closeConfigItem();
            }}
          />
        </div>
      </OffCanvas>
      <VariablesDocumentation />
    </Card>
  );
}
