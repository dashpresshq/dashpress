import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  BASE_ROLE_FORM_SCHEMA,
  IBaseRoleForm,
} from "shared/form-schemas/roles/base";

export function CreateRoleForm({ onSubmit }: IFormProps<IBaseRoleForm>) {
  return (
    <SchemaForm<IBaseRoleForm>
      onSubmit={onSubmit}
      buttonText={`${ButtonLang.create} Role`}
      fields={BASE_ROLE_FORM_SCHEMA}
      resetForm
    />
  );
}
