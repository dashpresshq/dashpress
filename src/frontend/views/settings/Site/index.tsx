import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { ISiteSettings } from "frontend/hooks/app/site.config";
import { BaseSettingsLayout } from "../_Base";
import { SiteSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function SiteSettings() {
  const siteSettings = useAppConfiguration<ISiteSettings>("site_settings");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("site_settings");

  useSetPageDetails({
    pageTitle: "Site Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title="Site Settings">
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
