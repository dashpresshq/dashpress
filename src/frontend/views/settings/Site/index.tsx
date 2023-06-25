import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ISiteSettings } from "shared/types/config";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { BaseSettingsLayout } from "../_Base";
import { SiteSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("site_settings");

export function SiteSettings() {
  const siteSettings = useAppConfiguration<ISiteSettings>("site_settings");

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
