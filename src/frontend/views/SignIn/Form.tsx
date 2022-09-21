import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  AUTH_SIGNIN_FORM_SCHEMA,
  ISignInForm,
} from "shared/form-schemas/auth/signin";

export function SignInForm({ onSubmit }: IFormProps<ISignInForm>) {
  const defaultValue = process.env.NEXT_PUBLIC_IS_DEMO
    ? {
        username: "root",
        password: "password",
      }
    : {};
  return (
    <SchemaForm<ISignInForm>
      onSubmit={onSubmit}
      initialValues={{
        ...defaultValue,
        rememberMe: true,
      }}
      buttonText="Sign In"
      fields={AUTH_SIGNIN_FORM_SCHEMA}
    />
  );
}
