import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  UPDATE_USER_FORM_SCHEMA,
  IUpdateUserForm,
} from "shared/form-schemas/users/update";
import { ADMIN_USERS_CRUD_CONFIG } from "../users.store";

export function UpdateUserForm({
  onSubmit,
  initialValues,
}: IFormProps<IUpdateUserForm>) {
  return (
    <SchemaForm
      buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.UPDATE}
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon="save"
      fields={UPDATE_USER_FORM_SCHEMA}
      formExtension={{
        fieldsState: `return {
          role: {
              disabled: $.auth.username === $.routeParams.username 
          }
        }`,
      }}
    />
  );
}
