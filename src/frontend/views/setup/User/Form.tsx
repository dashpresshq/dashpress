import {
  ISetupUserForm,
  SETUP_USER_FORM_SCHEMA,
} from "shared/form-schemas/setup/user";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IFormProps } from "frontend/lib/form/types";

export function UserSetupForm({ onSubmit }: IFormProps<ISetupUserForm>) {
  return (
    <SchemaForm<ISetupUserForm>
      buttonText={(isSubmitting) =>
        isSubmitting ? "Setting Up Account" : "Setup Account"
      }
      onSubmit={onSubmit}
      icon="no-icon"
      fields={SETUP_USER_FORM_SCHEMA}
    />
  );
}
