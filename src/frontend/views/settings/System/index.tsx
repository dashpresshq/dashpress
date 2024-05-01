import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { SystemSettingsDocumentation } from "frontend/docs/system-settings";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IBaseSystemSettings } from "shared/configurations/system";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

export function SystemSettings() {
  const systemSettings = useAppConfiguration("system_settings");
  const domainMessages = useAppConfigurationDomainMessages("system_settings");

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("system_settings");

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          loading={systemSettings.isLoading}
          error={systemSettings.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<IBaseSystemSettings>
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={systemSettings.data}
            systemIcon="Save"
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={{
              tokenValidityDurationInDays: {
                label: msg`Token Validity Duration In Days`,
                type: "number",
                validations: [
                  {
                    validationType: "required",
                  },
                  {
                    validationType: "min",
                    constraint: {
                      value: 1,
                    },
                  },
                ],
              },
            }}
          />
        </ViewStateMachine>
      </SectionBox>
      <SystemSettingsDocumentation />
    </BaseSettingsLayout>
  );
}
