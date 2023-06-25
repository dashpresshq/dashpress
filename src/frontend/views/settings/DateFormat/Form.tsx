import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("default_date_format");

type IDateFormatSettings = {
  format: string;
};

export function DateFormatSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<IDateFormatSettings>) {
  return (
    <SchemaForm<IDateFormatSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
      icon="save"
      fields={{
        format: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
      }}
    />
  );
}
