import { ButtonLang } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  CREATE_USER_FORM_SCHEMA,
  ICreateUserForm,
} from "shared/form-schemas/users/create";

export function CreateUserForm({ onSubmit }: IFormProps<ICreateUserForm>) {
  return (
    <SchemaForm<ICreateUserForm>
      onSubmit={onSubmit}
      buttonText={ButtonLang.create}
      fields={CREATE_USER_FORM_SCHEMA}
      resetForm
    />
  );
}
