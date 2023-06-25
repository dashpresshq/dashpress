import { IFormProps } from "frontend/lib/form/types";
import {
  CHANGE_PASSWORD_FORM_SCHEMA,
  IChangePasswordForm,
} from "shared/form-schemas/profile/password";
import { SchemaForm } from "frontend/components/SchemaForm";
import { PASSWORD_CRUD_CONFIG } from "../constants";

export function ChangePasswordForm({
  onSubmit,
}: IFormProps<IChangePasswordForm>) {
  return (
    <SchemaForm<IChangePasswordForm>
      onSubmit={onSubmit}
      icon="no-icon"
      buttonText={PASSWORD_CRUD_CONFIG.FORM_LANG.UPDATE}
      fields={CHANGE_PASSWORD_FORM_SCHEMA}
      resetForm
    />
  );
}
