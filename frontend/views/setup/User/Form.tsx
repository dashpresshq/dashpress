import { FormInput, FormButton } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { alphaNumeric, composeValidators, required } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";

export interface IUserSetupForm {
  name: string;
  username: string;
  password: string;
}

export function UserSetupForm({ onSubmit }: IFormProps<IUserSetupForm>) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="username"
            validate={composeValidators(required, alphaNumeric)}
            validateFields={[]}
          >
            {({ input, meta }) => (
              <FormInput label="Username" meta={meta} required input={input} />
            )}
          </Field>

          <Field name="name" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Name" meta={meta} required input={input} />
            )}
          </Field>

          <Field
            name="password"
            validate={required}
            required
            validateFields={[]}
          >
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

          <FormButton
            text="Create First User"
            isMakingRequest={submitting}
            disabled={pristine}
            block
          />
        </form>
      )}
    />
  );
}
