import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  UPDATE_USER_FORM_SCHEMA,
  IUpdateUserForm,
} from "shared/form-schemas/users/update";

export function UpdateUserForm({
  onSubmit,
  initialValues,
}: IFormProps<IUpdateUserForm>) {
  return (
    <SchemaForm
      buttonText={`${ButtonLang.update} User Profile`}
      onSubmit={onSubmit}
      initialValues={initialValues}
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
