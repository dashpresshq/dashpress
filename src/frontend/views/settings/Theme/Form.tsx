import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IThemeSettings } from "frontend/_layouts/useAppTheme";

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
            hidden: $.formValues.theme === "light"
          },
          primary: {
            hidden: $.formValues.theme === "dark"
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
        theme: {
          type: "selection",
          validations: [
            {
              validationType: "required",
            },
          ],
          selections: [
            {
              label: "Light",
              value: "light",
            },
            {
              label: "Dark",
              value: "dark",
            },
          ],
        },
      }}
    />
  );
}
