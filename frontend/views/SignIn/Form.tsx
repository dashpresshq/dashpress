import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  AUTH_SIGNIN_FORM_SCHEMA,
  ISignInForm,
} from "shared/form-schemas/auth/signin";

export function SignInForm({ onSubmit }: IFormProps<ISignInForm>) {
  return (
    <SchemaForm<ISignInForm>
      onSubmit={onSubmit}
      initialValues={{ rememberMe: true }}
      buttonText="Sign In"
      fields={AUTH_SIGNIN_FORM_SCHEMA}
    />
  );
}
