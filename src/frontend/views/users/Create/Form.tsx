import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm/SchemaForm";
import {
  CREATE_USER_FORM_SCHEMA,
  ICreateUserForm,
} from "shared/form-schemas/users/create";

export function CreateUserForm({ onSubmit }: IFormProps<ICreateUserForm>) {
  return (
    <SchemaForm<ICreateUserForm>
      onSubmit={onSubmit}
      buttonText={`${ButtonLang.create} User`}
      fields={CREATE_USER_FORM_SCHEMA}
      resetForm
    />
  );
}
