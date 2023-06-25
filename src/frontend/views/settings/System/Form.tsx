import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IBaseSystemSettings } from "shared/configurations/system";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("system_settings");

export function SystemSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IBaseSystemSettings>) {
  return (
    <SchemaForm<IBaseSystemSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon="save"
      buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
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
