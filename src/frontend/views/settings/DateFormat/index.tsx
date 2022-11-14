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
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { format as dateFnsFormat } from "date-fns";
import { ToastService } from "@hadmean/protozoa";
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

  return (
    <BaseSettingsLayout>
      <SectionBox
        title="Date Format Settings"
        description="Using format from https://date-fns.org/docs/format"
        iconButtons={[
          {
            action: "https://date-fns.org/docs/format",
            icon: "help",
            label: "Go to https://date-fns.org/docs/format",
          },
        ]}
      >
        <ViewStateMachine
          loading={defaultDateFormat.isLoading}
          error={defaultDateFormat.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <DateFormatSettingsForm
            onSubmit={async ({ format }) => {
              try {
                dateFnsFormat(new Date(), format);
                await upsertConfigurationMutation.mutateAsync(format);
              } catch (error) {
                ToastService.error(
                  "Invalid Date Format!. Please go to https://date-fns.org/docs/format to see valid formats"
                );
              }
            }}
            initialValues={{ format: defaultDateFormat.data }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
