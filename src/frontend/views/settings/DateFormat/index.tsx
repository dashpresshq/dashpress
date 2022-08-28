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
import { BaseSettingsLayout } from "../_Base";
import { DateFormatSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function DateFormatSettings() {
  const defaultDateFormat = useAppConfiguration<string>("default_date_format");

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "default_date_format"
  );

  useSetPageDetails({
    pageTitle: "Date Format Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const viewStateMachine = createViewStateMachine(
    defaultDateFormat.isLoading,
    defaultDateFormat.error
  );

  return (
    <BaseSettingsLayout>
      <SectionBox
        title="Date Format Settings"
        description="Using format from https://date-fns.org/docs/format"
      >
        {viewStateMachine.type === "error" && (
          <ErrorAlert message={viewStateMachine.message} />
        )}
        {viewStateMachine.type === "loading" && (
          <FormSkeleton schema={[FormSkeletonSchema.Input]} />
        )}
        {viewStateMachine.type === "render" && (
          <DateFormatSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values.format);
            }}
            initialValues={{ format: defaultDateFormat.data }}
          />
        )}
      </SectionBox>
    </BaseSettingsLayout>
  );
}
