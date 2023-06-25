import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  IResetPasswordForm,
  RESET_PASSWORD_FORM_SCHEMA,
} from "shared/form-schemas/users/reset-password";

export function ResetUserPasswordForm({
  onSubmit,
}: IFormProps<IResetPasswordForm>) {
  return (
    <SchemaForm<IResetPasswordForm>
      buttonText={(submitting) =>
        submitting ? "Resetting Password" : "Reset Password"
      }
      icon="no-icon"
      fields={RESET_PASSWORD_FORM_SCHEMA}
      onSubmit={onSubmit}
      resetForm
    />
  );
}
