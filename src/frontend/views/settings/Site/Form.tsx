import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { ISiteSettings } from "shared/types/config";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("site_settings");

export function SiteSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<ISiteSettings>) {
  return (
    <SchemaForm<ISiteSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon="save"
      buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
      fields={{
        name: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
        homeLink: {
          type: "text",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
        logo: {
          label: "Square Logo",
          type: "text",
          validations: [
            {
              validationType: "required",
            },
          ],
        },
        fullLogo: {
          label: "Full Length Logo",
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
