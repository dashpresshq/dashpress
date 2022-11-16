import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IThemeSettings } from "frontend/_layouts/useAppTheme";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "shared/form-schemas/profile/update";

type Settings = IThemeSettings & { theme: "dark" | "light" };

export function ThemeSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<Settings>) {
  return (
    <SchemaForm<Settings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Theme`}
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
