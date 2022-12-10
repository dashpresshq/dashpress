import { IFormProps } from "@hadmean/protozoa";
import {
  ISetupUserForm,
  SETUP_USER_FORM_SCHEMA,
} from "shared/form-schemas/setup/user";
import { SchemaForm } from "frontend/components/SchemaForm/SchemaForm";

export function UserSetupForm({ onSubmit }: IFormProps<ISetupUserForm>) {
  return (
    <SchemaForm<ISetupUserForm>
      buttonText="Create First User"
      onSubmit={onSubmit}
      fields={SETUP_USER_FORM_SCHEMA}
    />
  );
}
