import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";

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
      buttonText={`${ButtonLang.update} Date Format`}
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
