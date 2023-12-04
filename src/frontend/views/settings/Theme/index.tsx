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
import { THEME_SETTINGS_CRUD_CONFIG } from "frontend/_layouts/useAppTheme";
import {
  useUpsertUserPreferenceMutation,
  useUserPreference,
} from "frontend/hooks/auth/preferences.store";
import { ColorSchemes } from "shared/types/ui";
import { BaseSettingsLayout } from "../_Base";
import { ThemeSettingsForm } from "./Form";
import { SETTINGS_VIEW_KEY } from "../constants";

export function ThemeSettings() {
  const themeColor = useAppConfiguration("theme_color");

  const userPreference = useUserPreference<ColorSchemes>("theme");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("theme_color");

  const upsertUserPreferenceMutation =
    useUpsertUserPreferenceMutation<ColorSchemes>("theme");

  useSetPageDetails({
    pageTitle: THEME_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={THEME_SETTINGS_CRUD_CONFIG.TEXT_LANG.TITLE}>
        <ViewStateMachine
          loading={themeColor.isLoading || userPreference.isLoading}
          error={themeColor.error || userPreference.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <ThemeSettingsForm
            onSubmit={async ({ primary, primaryDark, theme }) => {
              await Promise.all([
                upsertUserPreferenceMutation.mutateAsync(theme),
                upsertConfigurationMutation.mutateAsync({
                  primary,
                  primaryDark,
                }),
              ]);
            }}
            initialValues={{ ...themeColor.data, theme: userPreference.data }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
