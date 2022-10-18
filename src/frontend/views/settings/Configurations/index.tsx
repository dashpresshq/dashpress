import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseSettingsLayout } from "../_Base";
// import { DateFormatSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";
import {
  useIntegrationConfigurationDeletionMutation,
  useIntegrationConfigurationUpdationMutation,
  useIntegrationsConfigurationList,
} from "./configurations.store";

function Base({ group }: { group: IntegrationsConfigurationGroup }) {
  const configurationList = useIntegrationsConfigurationList(group);
  const upsertConfigurationMutation =
    useIntegrationConfigurationUpdationMutation(group);
  const deleteConfigurationMutation =
    useIntegrationConfigurationDeletionMutation(group);

  return (
    <SectionBox
      title="Configurations"
      iconButtons={[
        {
          action: LINK_TO_DOCS(`integrations-configuration/${group}`),
          icon: "help",
          label: "Configurations Documentation",
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
              FormSkeletonSchema.Input,
            ]}
          />
        }
      >
        ofofo
        {/* <DateFormatSettingsForm
          onSave={async (values: { key: string; value: string }) => {
            await upsertConfigurationMutation.mutateAsync(values);
          }}
          onDelete={async (key: string) => {
            await deleteConfigurationMutation.mutateAsync({ key });
          }}
          initialValues={configurationList}
        /> */}
      </ViewStateMachine>
    </SectionBox>
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
      <Base group={IntegrationsConfigurationGroup.Constants} />
      <Base group={IntegrationsConfigurationGroup.Credentials} />
      <Base group={IntegrationsConfigurationGroup.Env} />
    </BaseSettingsLayout>
  );
}
