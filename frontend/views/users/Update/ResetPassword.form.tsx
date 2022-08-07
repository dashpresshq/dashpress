import { FormInput, FormButton } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { required } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";

interface IResetPasswordForm {
  password: string;
}

export function ResetUserPasswordForm({
  onSubmit,
}: IFormProps<IResetPasswordForm>) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="password" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="New Password"
                type="password"
                meta={meta}
                required
                input={input}
              />
            )}
          </Field>

          <FormButton
            text="Reset Password"
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
