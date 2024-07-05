import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { SystemSettingsDocumentation } from "frontend/docs/system-settings";
import type { IBaseSystemSettings } from "shared/configurations/system";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SchemaForm } from "@/components/app/form/schema";
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
