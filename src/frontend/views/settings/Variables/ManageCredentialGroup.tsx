import {
  DeleteButton,
  OffCanvas,
  SoftButton,
  Spacer,
  Stack,
  Typo,
} from "@hadmean/chromista";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import { ToastService, useApi } from "@hadmean/protozoa";
import {
  IPageDetails,
  useSetCurrentActionItems,
} from "frontend/lib/routing/usePageDetails";
import { HelpCircle, Plus } from "react-feather";
import { SchemaForm } from "frontend/components/SchemaForm";
import { USER_PERMISSIONS } from "shared/constants/user";
import { usePasswordStore } from "frontend/views/integrations/password.store";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
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
              id: "add",
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
          onClick: () =>
            window.open(LINK_TO_DOCS(`integrations/variables#${group}`)),
          IconComponent: HelpCircle,
          label: `What are ${INTEGRATIONS_GROUP_CONFIG[group].crudConfig.TEXT_LANG.TITLE}`,
        },
      ],
    };
  }, [group, currentTab, canManageAction]);

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

  if (canManageAction) {
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
          tableData.data.length > 0 &&
          !revealedCredentials.data && (
            <Spacer>
              <Typo.SM textStyle="italic">
                For security reasons, Please input your account password to be
                able to reveal values
              </Typo.SM>
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
                icon="eye"
                buttonText={(isSubmitting) =>
                  isSubmitting ? "Revealing Secrets" : "Reveal Secrets"
                }
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
    </>
  );
}
