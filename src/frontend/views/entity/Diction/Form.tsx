import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";

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
      buttonText={
        MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_diction").FORM_LANG.UPSERT
      }
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
                length: 32,
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
                length: 32,
              },
            },
          ],
        },
      }}
    />
  );
}
