import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  BASE_ROLE_FORM_SCHEMA,
  IBaseRoleForm,
} from "shared/form-schemas/roles/base";
import { ADMIN_ROLES_CRUD_CONFIG } from "../roles.store";

export function CreateRoleForm({ onSubmit }: IFormProps<IBaseRoleForm>) {
  return (
    <SchemaForm<IBaseRoleForm>
      onSubmit={onSubmit}
      buttonText={ADMIN_ROLES_CRUD_CONFIG.FORM_LANG.CREATE}
      fields={BASE_ROLE_FORM_SCHEMA}
      icon="add"
      resetForm
    />
  );
}
