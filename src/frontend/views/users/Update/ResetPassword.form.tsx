import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm/SchemaForm";
import {
  IResetPasswordForm,
  RESET_PASSWORD_FORM_SCHEMA,
} from "shared/form-schemas/users/reset-password";

export function ResetUserPasswordForm({
  onSubmit,
}: IFormProps<IResetPasswordForm>) {
  return (
    <SchemaForm<IResetPasswordForm>
      buttonText="Reset Password"
      fields={RESET_PASSWORD_FORM_SCHEMA}
      onSubmit={onSubmit}
      resetForm
    />
  );
}
