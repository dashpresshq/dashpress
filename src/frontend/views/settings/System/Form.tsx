import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ISystemSettings } from "shared/configuration.constants";

export function SystemSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<ISystemSettings>) {
  return (
    <SchemaForm<ISystemSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} System Settings`}
      fields={{
        tokenValidityDurationInDays: {
          type: "number",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
        forceIntrospection: {
          type: "boolean",
          validations: [],
        },
      }}
    />
  );
}
