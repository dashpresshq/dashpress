import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { format as dateFnsFormat } from "date-fns";
import { ToastService } from "@hadmean/protozoa";
import { BaseSettingsLayout } from "../_Base";
import { DateFormatSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";
import { DATE_FORMAT_SETTINGS_CRUD_CONFIG } from "./constants";

export function DateFormatSettings() {
  const defaultDateFormat = useAppConfiguration<string>(
    "default_date_format",
    DATE_FORMAT_SETTINGS_CRUD_CONFIG
  );

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "default_date_format",
    DATE_FORMAT_SETTINGS_CRUD_CONFIG
  );

  useSetPageDetails({
    pageTitle: DATE_FORMAT_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={DATE_FORMAT_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}
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
