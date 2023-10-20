import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { ISingularPlural } from "shared/types/config";

export function EntityDictionForm({
  onSubmit,
  initialValues,
}: IFormProps<ISingularPlural>) {
  return (
    <SchemaForm<ISingularPlural>
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
