import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IThemeSettings } from "frontend/_layouts/useAppTheme";

export function ThemeSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IThemeSettings>) {
  return (
    <SchemaForm<IThemeSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Theme`}
      formExtension={{
        fieldsState: `
        return {
          primaryDark: {
            hidden: !$.formValues.dark
          },
          primary: {
            hidden: !!$.formValues.dark
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
        dark: {
          type: "boolean",
          validations: [],
        },
      }}
    />
  );
}
