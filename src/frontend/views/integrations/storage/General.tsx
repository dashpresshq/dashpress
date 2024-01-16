import { SchemaForm } from "frontend/components/SchemaForm";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { AppConfigurationValueType } from "shared/configurations/constants";

export function GeneralStorageSettings() {
  const fileUploadSettings = useAppConfiguration("file_upload_settings");

  const upsertFileUploadSettingsMutation = useUpsertConfigurationMutation(
    "file_upload_settings"
  );

  return (
    <ViewStateMachine
      loading={fileUploadSettings.isLoading}
      error={fileUploadSettings.error}
      loader={
        <FormSkeleton
          schema={[
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
          ]}
        />
      }
    >
      {/* TODO: documentation */}
      <SchemaForm<AppConfigurationValueType<"file_upload_settings">>
        initialValues={fileUploadSettings.data}
        fields={{
          filePathFormat: {
            type: "text",
            validations: [
              {
                validationType: "required",
                errorMessage: "Required",
              },
            ],
          },

          fileNameFormat: {
            type: "text",
            validations: [
              {
                validationType: "required",
                errorMessage: "Required",
              },
            ],
          },

          defaultMaxFileSizeInMB: {
            type: "number",
            label: "Maximum file size to upload in MB",
            validations: [
              {
                validationType: "required",
                errorMessage: "Required",
              },
            ],
          },
        }}
        onSubmit={upsertFileUploadSettingsMutation.mutateAsync}
        buttonText={
          MAKE_APP_CONFIGURATION_CRUD_CONFIG("file_upload_settings").FORM_LANG
            .UPSERT
        }
        systemIcon="Save"
      />
    </ViewStateMachine>
  );
}
