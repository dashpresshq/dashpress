import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { ISiteSettings } from "frontend/hooks/app/site.config";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

export function SiteSettingsForm({
  onSubmit,
  initialValues,
}: IFormProps<ISiteSettings>) {
  return (
    <SchemaForm<ISiteSettings>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.update} Site Settings`}
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
