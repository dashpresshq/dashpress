import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { format as dateFnsFormat } from "date-fns";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { ToastService } from "frontend/lib/toast";
import { SchemaForm } from "frontend/components/SchemaForm";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

type IDateFormatSettings = {
  format: string;
};

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("default_date_format");

export function DateFormatSettings() {
  const defaultDateFormat = useAppConfiguration("default_date_format");

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "default_date_format"
  );

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
        actionButtons={[
          {
            _type: "normal",
            action: "https://date-fns.org/docs/format",
            icon: "help",
            label: "Using https://date-fns.org/docs/format",
          },
        ]}
      >
        <ViewStateMachine
          loading={defaultDateFormat.isLoading}
          error={defaultDateFormat.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<IDateFormatSettings>
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
            buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
            icon="save"
            fields={{
              format: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
            }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
