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
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useUpdateUserPreferencesMutation } from "frontend/views/account/account.store";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { IThemeSettings } from "frontend/_layouts/types";
import { BaseSettingsLayout } from "../_Base";
import { ThemeSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function ThemeSettings() {
  const themeColor = useAppConfiguration<IThemeSettings>("theme_color");

  const userPreferences = useAuthenticatedUserPreferences();

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("theme_color");

  const updateUserPreferencesMutation = useUpdateUserPreferencesMutation();

  useSetPageDetails({
    pageTitle: "Theme Settings",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title="Theme Settings">
        <ViewStateMachine
          loading={themeColor.isLoading || userPreferences.isLoading}
          error={themeColor.error || userPreferences.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <ThemeSettingsForm
            onSubmit={async ({ primary, primaryDark, theme }) => {
              await Promise.all([
                updateUserPreferencesMutation.mutateAsync({ theme }),
                upsertConfigurationMutation.mutateAsync({
                  primary,
                  primaryDark,
                }),
              ]);
            }}
            initialValues={{ ...themeColor.data, ...userPreferences.data }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
