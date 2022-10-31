import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

type IThemeSettings = {
  primary: string;
  dark: boolean;
};

export function ThemeSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IThemeSettings>) {
  return (
    <SchemaForm<IThemeSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Theme`}
      fields={{
        primary: {
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
