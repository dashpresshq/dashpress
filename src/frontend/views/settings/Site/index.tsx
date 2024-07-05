import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import type { AppConfigurationValueType } from "shared/configurations/constants";
import { msg } from "@lingui/macro";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { SchemaForm } from "@/components/app/form/schema";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { SectionBox } from "@/components/app/section-box";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

export function SiteSettings() {
  const siteSettings = useAppConfiguration("site_settings");

  const domainMessages = useAppConfigurationDomainMessages("site_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("site_settings");

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={domainMessages.TEXT_LANG.TITLE}>
        <ViewStateMachine
          loading={siteSettings.isLoading}
          error={siteSettings.error}
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          <SchemaForm<AppConfigurationValueType<"site_settings">>
            onSubmit={upsertConfigurationMutation.mutateAsync}
            initialValues={siteSettings.data}
            systemIcon="Save"
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={{
              name: {
                label: msg`Name`,
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              homeLink: {
                label: msg`Home Link`,
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              logo: {
                label: msg`Small Logo`,
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              fullLogo: {
                label: msg`Large Logo`,
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
