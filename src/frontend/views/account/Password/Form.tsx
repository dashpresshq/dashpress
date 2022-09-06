import { IFormProps } from "frontend/lib/form/types";
import {
  CHANGE_PASSWORD_FORM_SCHEMA,
  IChangePasswordForm,
} from "shared/form-schemas/profile/password";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

export function ChangePasswordForm({
  onSubmit,
}: IFormProps<IChangePasswordForm>) {
  return (
    <SchemaForm<IChangePasswordForm>
      onSubmit={onSubmit}
      buttonText="Change Password"
      fields={CHANGE_PASSWORD_FORM_SCHEMA}
      resetForm
    />
  );
}
