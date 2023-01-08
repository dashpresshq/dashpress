import {
  DeleteButton,
  ITableColumn,
  OffCanvas,
  SoftButton,
  Spacer,
  Stack,
  Text,
} from "@hadmean/chromista";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FEPaginationTable } from "frontend/components/FEPaginationTable";
import { ToastService, useApi } from "@hadmean/protozoa";
import {
  IPageDetails,
  useSetCurrentActionItems,
} from "frontend/lib/routing/usePageDetails";
import { HelpCircle, Plus } from "react-feather";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useUserHasPermissions } from "frontend/hooks/auth/user.store";
import { USER_PERMISSIONS } from "shared/types/user";
import { usePasswordStore } from "frontend/views/integrations/password.store";
import {
  INTEGRATIONS_GROUP_ENDPOINT,
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
  useRevealedCredentialsList,
} from "./configurations.store";
import { KeyValueForm } from "./Form";
import { IKeyValue } from "./types";
import { INTEGRATIONS_GROUP_CONFIG } from "./constants";

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
    useIntegrationConfigurationUpdationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);

  const tableData = useApi<IKeyValue[]>(dataEndpoint);

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

  const hasPermission = useUserHasPermissions([
    USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  ]);

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
    [deleteConfigurationMutation.isLoading, passwordStore.password]
  );

  const canManageAction = !(
    group === IntegrationsConfigurationGroup.Credentials &&
    !hasPermission(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)
  );

  const actionItems:
    | Pick<IPageDetails, "actionItems" | "secondaryActionItems">
    | undefined = useMemo(() => {
    if (group !== currentTab) {
      return undefined;
    }
    return {
      actionItems: canManageAction
        ? [
            {
              onClick: () => {
                setCurrentConfigItem(NEW_CONFIG_ITEM);
              },
              IconComponent: Plus,
              label: `Add New ${INTEGRATIONS_GROUP_CONFIG[group].singular}`,
            },
          ]
        : [],
      secondaryActionItems: [
        {
          onClick: () =>
            window.open(LINK_TO_DOCS(`integrations/variables#${group}`)),
          IconComponent: HelpCircle,
          label: `What are ${INTEGRATIONS_GROUP_CONFIG[group].label}`,
        },
      ],
    };
  }, [group, currentTab, canManageAction]);

  useSetCurrentActionItems(actionItems);

  const tableColumns: ITableColumn[] = [
    {
      Header: "Key",
      accessor: "key",
      filter: {
        _type: "string",
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

  if (canManageAction) {
    tableColumns.push({
      Header: "Action",
      Cell: MemoizedAction,
    });
  }

  return (
    <>
      <section aria-label={`${group} priviledge section`}>
        {group === IntegrationsConfigurationGroup.Credentials &&
          hasPermission(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS) &&
          (tableData?.data || []).length > 0 &&
          !revealedCredentials.data && (
            <Spacer>
              <Text textStyle="italic" size="5">
                For security reasons, Please input your account password to be
                able to reveal values
              </Text>
              <Spacer />
              <SchemaForm
                fields={{
                  password: {
                    type: "password",
                    validations: [
                      {
                        validationType: "required",
                      },
                    ],
                  },
                }}
                onSubmit={async ({ password }: { password: string }) => {
                  passwordStore.setPassword(password);
                }}
                buttonText={
                  revealedCredentials.isLoading
                    ? "Just a sec..."
                    : "Reveal Secrets"
                }
              />
            </Spacer>
          )}
        {!canManageAction && (tableData?.data || []).length > 0 && (
          <Spacer>
            <Text textStyle="italic" size="5">
              Your account does not have the permission to view secret values or
              manage them
            </Text>
          </Spacer>
        )}
      </section>

      <FEPaginationTable<IKeyValue>
        dataEndpoint={dataEndpoint}
        emptyMessage={`No ${INTEGRATIONS_GROUP_CONFIG[group].label} Has Been Added Yet`}
        columns={tableColumns}
      />

      <OffCanvas
        title={
          currentConfigItem === NEW_CONFIG_ITEM
            ? `Create ${INTEGRATIONS_GROUP_CONFIG[group].singular}`
            : `Update ${INTEGRATIONS_GROUP_CONFIG[group].singular}`
        }
        onClose={closeConfigItem}
        show={!!currentConfigItem}
      >
        <KeyValueForm
          initialValues={(tableData?.data || []).find(
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
