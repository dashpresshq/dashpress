import { IFormProps } from "@hadmean/protozoa";
import { Text } from "@hadmean/chromista";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  AUTH_SIGNIN_FORM_SCHEMA,
  ISignInForm,
} from "shared/form-schemas/auth/signin";

export function SignInForm({ onSubmit }: IFormProps<ISignInForm>) {
  return (
    <>
      {process.env.NEXT_PUBLIC_IS_DEMO && (
        <div aria-label="Demo App Credentials">
          <Text size="6">
            Username is <b>root</b>
          </Text>
          <Text size="6">
            Password is <b>password</b>
          </Text>
        </div>
      )}
      <SchemaForm<ISignInForm>
        onSubmit={onSubmit}
        initialValues={{ rememberMe: true }}
        buttonText="Sign In"
        fields={AUTH_SIGNIN_FORM_SCHEMA}
      />
    </>
  );
}
