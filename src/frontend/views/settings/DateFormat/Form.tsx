import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { DATE_FORMAT_SETTINGS_CRUD_CONFIG } from "./constants";

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
      buttonText={DATE_FORMAT_SETTINGS_CRUD_CONFIG.FORM_LANG.UPSERT}
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
