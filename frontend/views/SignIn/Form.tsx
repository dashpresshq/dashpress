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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <Field name="username" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="Username"
                meta={meta}
                input={input}
                data-test-id="signin__email"
              />
            )}
          </Field>
          <Field name="password" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="Password"
                type="password"
                meta={meta}
                input={input}
                data-test-id="signin__password"
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
