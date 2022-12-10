import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm/SchemaForm";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IUserPreferences } from "shared/types/user";

export function UserPreferencesForm({
  onSubmit,
  initialValues,
}: IFormProps<IUserPreferences>) {
  return (
    <SchemaForm<IUserPreferences>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={`${ButtonLang.upsert} Preferences`}
      fields={UPDATE_USER_PREFERENCES_FORM_SCHEMA}
    />
  );
}
