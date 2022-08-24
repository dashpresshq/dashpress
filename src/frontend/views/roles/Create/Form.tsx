import { ButtonLang } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  CREATE_ROLE_FORM_SCHEMA,
  ICreateRoleForm,
} from "shared/form-schemas/roles/create";

export function CreateRoleForm({ onSubmit }: IFormProps<ICreateRoleForm>) {
  return (
    <SchemaForm<ICreateRoleForm>
      onSubmit={onSubmit}
      buttonText={ButtonLang.create}
      fields={CREATE_ROLE_FORM_SCHEMA}
      resetForm
    />
  );
}
