import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  Spacer,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";
import {
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
  useIntegrationsConfigurationList,
} from "./configurations.store";
import { KeyValueForm } from "./Form";

function Base({ group }: { group: IntegrationsConfigurationGroup }) {
  const configurationList = useIntegrationsConfigurationList(group);
  const upsertConfigurationMutation =
    useIntegrationConfigurationUpdationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);

  return (
    <>
      <SectionBox
        title={`${group} Configurations`}
        iconButtons={[
          {
            action: LINK_TO_DOCS(`integrations-configuration/${group}`),
            icon: "help",
            label: `${group} Configurations Documentation`,
          },
        ]}
      >
        <ViewStateMachine
          loading={configurationList.isLoading}
          error={configurationList.error}
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          {/* <DateFormatSettingsForm
          onSave={async (values: { key: string; value: string }) => {
            await upsertConfigurationMutation.mutateAsync(values);
          }}
          onDelete={async (key: string) => {
            await deleteConfigurationMutation.mutateAsync({ key });
          }}
          initialValues={configurationList}
        /> */}
          <KeyValueForm
            initialValues={configurationList.data || {}}
            onSubmit={async (values: { key: string; value: string }) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
          />
        </ViewStateMachine>
      </SectionBox>
      <Spacer />
    </>
  );
}

export function IntegrationsConfigurationSettings() {
  useSetPageDetails({
    pageTitle: "Configurations",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  //   USER_PERMISSIONS.CAN_MANAGE_CREDENTIALS

  return (
    <BaseSettingsLayout>
      <Base group={IntegrationsConfigurationGroup.Credentials} />
      <Base group={IntegrationsConfigurationGroup.Env} />
      <Base group={IntegrationsConfigurationGroup.Constants} />
    </BaseSettingsLayout>
  );
}
