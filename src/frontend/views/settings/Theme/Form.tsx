import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IThemeSettings } from "frontend/_layouts/types";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";

type Settings = IThemeSettings & { theme: string };

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("theme_color");

export function ThemeSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<Settings>) {
  return (
    <SchemaForm<Settings>
      onSubmit={onSubmit}
      initialValues={initialValues}
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
  );
}
