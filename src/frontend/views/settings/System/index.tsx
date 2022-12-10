import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ISystemSettings } from "shared/configuration.constants";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { BaseSettingsLayout } from "../_Base";
import { SystemSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function SystemSettings() {
  const systemSettings =
    useAppConfiguration<ISystemSettings>("system_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("system_settings");

  useSetPageDetails({
    pageTitle: "System Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title="System Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/system"),
            icon: "help",
            label: "System Settings Documentation",
          },
        ]}
      >
        <ViewStateMachine
          loading={systemSettings.isLoading}
          error={systemSettings.error}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <SystemSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            initialValues={systemSettings.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
