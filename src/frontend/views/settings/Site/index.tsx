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
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { SchemaForm } from "frontend/components/SchemaForm";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { msg } from "@lingui/macro";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("site_settings");

export function SiteSettings() {
  const siteSettings = useAppConfiguration("site_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("site_settings");

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={CRUD_CONFIG.TEXT_LANG.TITLE}>
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
            buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
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
                label: msg`Link`,
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
