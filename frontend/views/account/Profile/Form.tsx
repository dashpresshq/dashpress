import { FormInput, FormButton } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { required } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";

export interface IAccountProfile {
  name: string;
}

export function UpdateProfileForm({
  onSubmit,
  initialValues,
}: IFormProps<IAccountProfile>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="name" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Name" required meta={meta} input={input} />
            )}
          </Field>
          <FormButton
            text="Update Profile"
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
