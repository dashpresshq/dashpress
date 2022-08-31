import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { createViewStateMachine } from "frontend/lib/create-view-state-machine";
import { USER_PERMISSIONS } from "shared/types";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ISystemSettings } from "shared/configuration.constants";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseSettingsLayout } from "../_Base";
import { SystemSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function SystemSettings() {
  const systemSystems = useAppConfiguration<ISystemSettings>("system_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("system_settings");

  useSetPageDetails({
    pageTitle: "System Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const viewStateMachine = createViewStateMachine(
    systemSystems.isLoading,
    systemSystems.error
  );

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
        {viewStateMachine.type === "error" && (
          <ErrorAlert message={viewStateMachine.message} />
        )}
        {viewStateMachine.type === "loading" && (
          <>
            <FormSkeleton schema={[FormSkeletonSchema.Input]} />
            <FormSkeleton schema={[FormSkeletonSchema.Input]} />
          </>
        )}
        {viewStateMachine.type === "render" && (
          <SystemSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            initialValues={systemSystems.data}
          />
        )}
      </SectionBox>
    </BaseSettingsLayout>
  );
}
