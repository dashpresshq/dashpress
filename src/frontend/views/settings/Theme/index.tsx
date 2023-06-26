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
import { useUpdateUserPreferencesMutation } from "frontend/views/account/account.store";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { IThemeSettings } from "frontend/_layouts/types";
import { THEME_SETTINGS_CRUD_CONFIG } from "frontend/_layouts/useAppTheme";
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
    pageTitle: THEME_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={THEME_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}>
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
