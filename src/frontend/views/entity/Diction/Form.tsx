import { ButtonLang, IFormProps, VALIDATION_LENGTH } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";

type IDictionSettings = {
  plural: string;
  singular: string;
};

export function EntityDictionForm({
  onSubmit,
  initialValues,
}: IFormProps<IDictionSettings>) {
  return (
    <SchemaForm<IDictionSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Diction`}
      fields={{
        plural: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
            {
              validationType: "maxLength",
              constraint: {
                length: VALIDATION_LENGTH.NAMES,
              },
            },
          ],
        },
        singular: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
            {
              validationType: "maxLength",
              constraint: {
                length: VALIDATION_LENGTH.NAMES,
              },
            },
          ],
        },
      }}
    />
  );
}
