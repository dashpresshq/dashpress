import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ISiteSettings } from "shared/types/config";
import { SITE_SETTINGS_CRUD_CONFIG } from "./constants";

export function SiteSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<ISiteSettings>) {
  return (
    <SchemaForm<ISiteSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon="save"
      buttonText={SITE_SETTINGS_CRUD_CONFIG.FORM_LANG.UPSERT}
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
