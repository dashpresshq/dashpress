import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import type { AppConfigurationValueType } from "shared/configurations/constants";
import { msg } from "@lingui/macro";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SchemaForm } from "@/components/app/form/schema";

export function GeneralStorageSettings() {
  const fileUploadSettings = useAppConfiguration("file_upload_settings");

  const upsertFileUploadSettingsMutation = useUpsertConfigurationMutation(
    "file_upload_settings"
  );

  const domainMessages = useAppConfigurationDomainMessages(
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
            label: msg`File Path Format`,
            type: "text",
            validations: [
              {
                validationType: "required",
                errorMessage: msg`Required`,
              },
            ],
          },

          fileNameFormat: {
            label: msg`File Name Format`,
            type: "text",
            validations: [
              {
                validationType: "required",
                errorMessage: msg`Required`,
              },
            ],
          },

          defaultMaxFileSizeInMB: {
            type: "number",
            label: msg`Maximum file size to upload in MB`,
            validations: [
              {
                validationType: "required",
                errorMessage: msg`Required`,
              },
            ],
          },
        }}
        onSubmit={upsertFileUploadSettingsMutation.mutateAsync}
        buttonText={domainMessages.FORM_LANG.UPSERT}
        systemIcon="Save"
      />
    </ViewStateMachine>
  );
}
