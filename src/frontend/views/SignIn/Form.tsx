import { IFormProps } from "@hadmean/protozoa";
import { Typo } from "@hadmean/chromista";
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
          <Typo.XS>
            Username is <b>root</b>
          </Typo.XS>
          <Typo.XS>
            Password is <b>password</b>
          </Typo.XS>
        </div>
      )}
      <SchemaForm<ISignInForm>
        onSubmit={onSubmit}
        initialValues={{ rememberMe: true }}
        buttonText={(isSubmitting) =>
          isSubmitting ? "Just A Sec..." : "Sign In"
        }
        icon="no-icon"
        fields={AUTH_SIGNIN_FORM_SCHEMA}
      />
    </>
  );
}
