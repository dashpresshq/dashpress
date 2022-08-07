import {
  FormCheckBox,
  FormInput,
  FormButton,
} from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { required } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";

export interface ISignInForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function SignInForm({ onSubmit }: IFormProps<ISignInForm>) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="username" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Username" required meta={meta} input={input} />
            )}
          </Field>
          <Field name="password" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="Password"
                type="password"
                required
                meta={meta}
                input={input}
              />
            )}
          </Field>

          <Field name="rememberMe" validateFields={[]} type="checkbox">
            {({ input, meta }) => (
              <FormCheckBox label="Remember Me" meta={meta} input={input} />
            )}
          </Field>
          <FormButton
            text="Sign In"
            isMakingRequest={submitting}
            disabled={pristine}
            block
          />
        </form>
      )}
    />
  );
}
