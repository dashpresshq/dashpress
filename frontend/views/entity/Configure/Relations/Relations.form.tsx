import { FormButton, FormInput } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { ButtonLang, composeValidators, required } from "@gothicgeeks/shared";

import { IFormProps } from "../../../../lib/form/types";

interface IRelationsSettings {
  format: string;
}

export function EntityRelationsForm({
  onSubmit,
  initialValues,
}: IFormProps<IRelationsSettings>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="format"
            validate={composeValidators(required)}
            validateFields={[]}
          >
            {({ input, meta }) => (
              <FormInput
                label="Display Format"
                required
                meta={meta}
                input={input}
              />
            )}
          </Field>
          <FormButton
            text={`${ButtonLang.update} Format`}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
