import { IFormProps, VALIDATION_LENGTH } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ENTITY_DICTION_SETTINGS_CRUD_CONFIG } from "./constant";

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
      icon="save"
      buttonText={ENTITY_DICTION_SETTINGS_CRUD_CONFIG.FORM_LANG.UPSERT}
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
