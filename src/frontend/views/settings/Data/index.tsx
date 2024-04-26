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
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { msg } from "@lingui/macro";
import { i18nNoop } from "shared/lib/noop";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

type IDateFormatSettings = {
  format: string;
};

function MetaDataSettings() {
  const META_DATA_CRUD_CONFIG =
    MAKE_APP_CONFIGURATION_CRUD_CONFIG("metadata_columns");

  const metaDataColumns = useAppConfiguration("metadata_columns");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("metadata_columns");

  return (
    <SectionBox
      title={META_DATA_CRUD_CONFIG.TEXT_LANG.TITLE}
      description="The fields registered below will be automatically hidden on the create and edit forms"
    >
      <ViewStateMachine
        loading={metaDataColumns.isLoading}
        error={metaDataColumns.error}
        loader={
          <FormSkeleton
            schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
          />
        }
      >
        <SchemaForm<AppConfigurationValueType<"metadata_columns">>
          onSubmit={upsertConfigurationMutation.mutateAsync}
          initialValues={metaDataColumns.data}
          buttonText={META_DATA_CRUD_CONFIG.FORM_LANG.UPSERT}
          systemIcon="Save"
          fields={{
            createdAt: {
              label: msg`Created at`,
              type: "text",
              validations: [],
            },
            updatedAt: {
              label: msg`Updated at`,
              type: "text",
              validations: [],
            },
          }}
        />
      </ViewStateMachine>
    </SectionBox>
  );
}

const DATE_FORMAT_LIB_LINK = "https://date-fns.org/docs/format";

function DateSettings() {
  const DATE_FORMAT_CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG(
    "default_date_format"
  );
  const defaultDateFormat = useAppConfiguration("default_date_format");

  const upsertDateFormatConfigurationMutation = useUpsertConfigurationMutation(
    "default_date_format"
  );

  return (
    <SectionBox
      title={DATE_FORMAT_CRUD_CONFIG.TEXT_LANG.TITLE}
      actionButtons={[
        {
          id: "help",
          action: DATE_FORMAT_LIB_LINK,
          systemIcon: "Help",
          label: msg`${i18nNoop(DATE_FORMAT_LIB_LINK)}`,
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
              await upsertDateFormatConfigurationMutation.mutateAsync(format);
            } catch (error) {
              ToastService.error(
                "Invalid Date Format!. Please go to https://date-fns.org/docs/format to see valid formats"
              );
            }
          }}
          initialValues={{ format: defaultDateFormat.data }}
          buttonText={DATE_FORMAT_CRUD_CONFIG.FORM_LANG.UPSERT}
          systemIcon="Save"
          fields={{
            format: {
              label: msg`Format`,
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
  );
}

export function GeneralDataSettings() {
  useSetPageDetails({
    pageTitle: msg`General Data Settings`,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <DateSettings />
      <Spacer size="xl" />
      <MetaDataSettings />
    </BaseSettingsLayout>
  );
}
