import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IBaseSystemSettings } from "shared/configurations/system";

export function SystemSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IBaseSystemSettings>) {
  return (
    <SchemaForm<IBaseSystemSettings>
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
