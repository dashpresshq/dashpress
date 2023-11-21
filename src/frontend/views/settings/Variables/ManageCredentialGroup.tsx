import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import {
  IPageDetails,
  useSetCurrentActionItems,
} from "frontend/lib/routing/usePageDetails";
import { HelpCircle, Plus } from "react-feather";
import { USER_PERMISSIONS } from "shared/constants/user";
import { usePasswordStore } from "frontend/views/integrations/password.store";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { VariablesDocumentation } from "frontend/docs/variables";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { ToastService } from "frontend/lib/toast";
import { useApi } from "frontend/lib/data/useApi";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Typo } from "frontend/design-system/primitives/Typo";
import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import {
  PasswordMessage,
  PasswordToReveal,
} from "frontend/views/integrations/Password";
import {
  INTEGRATIONS_GROUP_ENDPOINT,
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpsertationMutation,
  useRevealedCredentialsList,
} from "./configurations.store";
import { KeyValueForm } from "./Form";
import { IKeyValue } from "./types";

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
  const [isDocOpen, setIsDocOpen] = useState(false);

  const revealedCredentials = useRevealedCredentialsList(group);

  useEffect(() => {
    if (
      revealedCredentials.error &&
      group === IntegrationsConfigurationGroup.Credentials
    ) {
      ToastService.error(revealedCredentials.error);
    }
  }, [revealedCredentials.error]);

  const passwordStore = usePasswordStore();

  const userHasPermission = useUserHasPermission();

  const [currentConfigItem, setCurrentConfigItem] = useState("");

  const closeConfigItem = () => {
    setCurrentConfigItem("");
  };

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IKeyValue>) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={() => setCurrentConfigItem(row.original.key)}
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            deleteConfigurationMutation.mutateAsync(row.original.key)
          }
          isMakingDeleteRequest={false}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [deleteConfigurationMutation.isLoading, passwordStore.password]
  );

  const canManageAction = !(
    group === IntegrationsConfigurationGroup.Credentials &&
    !userHasPermission(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)
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
              onClick: () => {
                setCurrentConfigItem(NEW_CONFIG_ITEM);
              },
              IconComponent: Plus,
              label:
                INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.CREATE,
            },
          ]
        : [],
      secondaryActionItems: [
        {
          id: "help",
          onClick: () => setIsDocOpen(true),
          IconComponent: HelpCircle,
          label: DOCUMENTATION_LABEL.CONCEPT(
            INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.TITLE
          ),
        },
      ],
    };
  }, [group, currentTab, canManageAction, showManageAction]);

  useSetCurrentActionItems(actionItems);

  const tableColumns: IFETableColumn<IKeyValue>[] = [
    {
      Header: "Key",
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
      Header: "Value",
      accessor: "value",
    },
  ];
  if (showManageAction) {
    tableColumns.push({
      Header: "Action",
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    });
  }

  return (
    <>
      <section aria-label={`${group} priviledge section`}>
        {group === IntegrationsConfigurationGroup.Credentials &&
          userHasPermission(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS) &&
          revealedCredentials.data === undefined && (
            <Spacer>
              <PasswordToReveal
                label="Secrets"
                isLoading={revealedCredentials.isLoading}
              />
            </Spacer>
          )}
        {!canManageAction && tableData.data.length > 0 && (
          <Spacer>
            <Typo.SM textStyle="italic">
              Your account does not have the permission to view secret values or
              manage them
            </Typo.SM>
          </Spacer>
        )}
      </section>

      <FEPaginationTable
        dataEndpoint={dataEndpoint}
        emptyMessage={
          INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.EMPTY_LIST
        }
        columns={tableColumns}
      />

      <OffCanvas
        title={
          currentConfigItem === NEW_CONFIG_ITEM
            ? INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.CREATE
            : INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.EDIT
        }
        onClose={closeConfigItem}
        show={!!currentConfigItem}
      >
        {group === IntegrationsConfigurationGroup.Credentials && (
          <>
            <PasswordMessage />
            <Spacer />
          </>
        )}
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
      </OffCanvas>
      <VariablesDocumentation
        title={INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </>
  );
}
