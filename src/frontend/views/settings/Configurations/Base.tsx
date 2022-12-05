import {
  DeleteButton,
  OffCanvas,
  SoftButton,
  Stack,
  StyledCard,
  Tabs,
} from "@hadmean/chromista";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { useCallback, useMemo, useState } from "react";

import { FEPaginationTable } from "frontend/lib/FEPaginationTable";
import { useApi } from "@hadmean/protozoa";
import {
  IPageDetails,
  useSetCurrentActionItems,
} from "frontend/lib/routing/usePageDetails";
import { HelpCircle, Plus } from "react-feather";
import {
  INTEGRATIONS_GROUP_ENDPOINT,
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
} from "./configurations.store";
import { KeyValueForm } from "./Form";
import { IKeyValue } from "./types";
import { INTEGRATIONS_GROUP_CONFIG } from "./constants";

const NEW_CONFIG_ITEM = "__new_config_item__";

/* CAN_MANAGE_INTEGRATIONS will be able to reveal, update, and delete */

function BaseIntegrationsConfiguration({
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
    [deleteConfigurationMutation.isLoading]
  );

  const actionItems:
    | Pick<IPageDetails, "actionItems" | "secondaryActionItems">
    | undefined = useMemo(() => {
    if (group !== currentTab) {
      return undefined;
    }
    return {
      actionItems: [
        {
          onClick: () => {
            setCurrentConfigItem(NEW_CONFIG_ITEM);
          },
          IconComponent: Plus,
          label: `Add New ${INTEGRATIONS_GROUP_CONFIG[group].singular}`,
        },
      ],
      secondaryActionItems: [
        {
          onClick: () =>
            window.open(LINK_TO_DOCS(`integrations-configuration/${group}`)),
          IconComponent: HelpCircle,
          // TODO documentation
          label: `What are ${INTEGRATIONS_GROUP_CONFIG[group].label}`,
        },
      ],
    };
  }, [group, currentTab]);

  useSetCurrentActionItems(actionItems);

  return (
    <>
      <FEPaginationTable<IKeyValue>
        dataEndpoint={dataEndpoint}
        emptyMessage={`No ${INTEGRATIONS_GROUP_CONFIG[group].label} Has Been Added Yet`}
        columns={[
          {
            Header: "Key",
            accessor: "key",
            disableSortBy: true,
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
            disableSortBy: true,
          },
          {
            Header: "Action",
            Cell: MemoizedAction,
          },
        ]}
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

export function BaseManageVariables() {
  const [currentTab, setCurrentTab] = useState<IntegrationsConfigurationGroup>(
    IntegrationsConfigurationGroup.Constants
  );
  return (
    <StyledCard>
      <Tabs
        padContent={false}
        currentTab={currentTab}
        onChange={(newTab) =>
          setCurrentTab(newTab as IntegrationsConfigurationGroup)
        }
        contents={[
          {
            overrideLabel: INTEGRATIONS_GROUP_CONFIG.constants.label,
            label: IntegrationsConfigurationGroup.Constants,
            content: (
              <BaseIntegrationsConfiguration
                group={IntegrationsConfigurationGroup.Constants}
                currentTab={currentTab}
              />
            ),
          },
          {
            overrideLabel: INTEGRATIONS_GROUP_CONFIG.credentials.label,
            label: IntegrationsConfigurationGroup.Credentials,
            content: (
              <BaseIntegrationsConfiguration
                group={IntegrationsConfigurationGroup.Credentials}
                currentTab={currentTab}
              />
            ),
          },
        ]}
      />
    </StyledCard>
  );
}

export const MangeVariablesPageTitle = "Manage Variables";
