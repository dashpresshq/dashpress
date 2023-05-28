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
import { ISiteSettings } from "shared/types/config";
import { BaseSettingsLayout } from "../_Base";
import { SiteSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";
import { SITE_SETTINGS_CRUD_CONFIG } from "./constants";

export function SiteSettings() {
  const siteSettings = useAppConfiguration<ISiteSettings>(
    "site_settings",
    SITE_SETTINGS_CRUD_CONFIG
  );

  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "site_settings",
    SITE_SETTINGS_CRUD_CONFIG
  );

  useSetPageDetails({
    pageTitle: SITE_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={SITE_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}>
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
          <SiteSettingsForm
            onSubmit={async (values) => {
              await upsertConfigurationMutation.mutateAsync(values);
            }}
            initialValues={siteSettings.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
