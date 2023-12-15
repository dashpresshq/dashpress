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
import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { ColorSchemes } from "shared/types/ui";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "frontend/views/account/Preferences/constants";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("theme_color");

type Settings = AppConfigurationValueType<"theme_color"> & {
  theme: ColorSchemes;
};

export function ThemeSettings() {
  const themeColor = useAppConfiguration("theme_color");

  const userPreference = useUserPreference("theme");

  const upsertConfigurationMutation =
    useUpsertConfigurationMutation("theme_color");

  const upsertUserPreferenceMutation = useUpsertUserPreferenceMutation("theme");

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
          <SchemaForm<Settings>
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
            icon="save"
            buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
            formExtension={{
              fieldsState: `
        return {
          primaryDark: {
            hidden: $.formValues.theme === "light" || !$.formValues.theme
          },
          primary: {
            hidden: $.formValues.theme === "dark" || !$.formValues.theme
          }
        }`,
            }}
            fields={{
              primary: {
                label: "Light Color Scheme",
                type: "color",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              primaryDark: {
                label: "Dark Color Scheme",
                type: "color",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              theme: UPDATE_USER_PREFERENCES_FORM_SCHEMA.theme,
            }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
