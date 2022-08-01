import { FormInput, FormButton } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import {
  composeValidators,
  matchOtherField,
  required,
} from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";

export interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}

export function ChangePasswordForm({
  onSubmit,
}: IFormProps<IChangePasswordForm>) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="oldPassword" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="Old Password"
                type="password"
                required
                meta={meta}
                input={input}
              />
            )}
          </Field>

          <Field name="newPassword" validate={required} validateFields={[]}>
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

          <Field
            name="reNewPassword"
            validate={composeValidators(
              required,
              matchOtherField("newPassword")
            )}
            validateFields={[]}
          >
            {({ input, meta }) => (
              <FormInput
                label="New Password Again"
                type="password"
                meta={meta}
                required
                input={input}
              />
            )}
          </Field>
          <FormButton
            text="Update Password"
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
