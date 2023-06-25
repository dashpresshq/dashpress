import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  CREATE_USER_FORM_SCHEMA,
  ICreateUserForm,
} from "shared/form-schemas/users/create";
import { ADMIN_USERS_CRUD_CONFIG } from "../users.store";

export function CreateUserForm({ onSubmit }: IFormProps<ICreateUserForm>) {
  return (
    <SchemaForm<ICreateUserForm>
      onSubmit={onSubmit}
      buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.CREATE}
      fields={CREATE_USER_FORM_SCHEMA}
      icon="add"
      resetForm
    />
  );
}
