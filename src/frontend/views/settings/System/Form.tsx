import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IBaseSystemSettings } from "shared/configurations/system";
import { SYSTEM_SETTINGS_CRUD_CONFIG } from "./constants";

export function SystemSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IBaseSystemSettings>) {
  return (
    <SchemaForm<IBaseSystemSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon="save"
      buttonText={SYSTEM_SETTINGS_CRUD_CONFIG.FORM_LANG.UPSERT}
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
