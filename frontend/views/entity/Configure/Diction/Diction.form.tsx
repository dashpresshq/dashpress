import { FormButton, FormInput } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
  VALIDATION_LENGTH,
} from "@gothicgeeks/shared";
import { IFormProps } from "../../../../lib/form/types";

interface IDictionSettings {
  plural: string;
  singular: string;
}

export function EntityDictionForm({
  onSubmit,
  initialValues,
}: IFormProps<IDictionSettings>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="plural"
            validate={composeValidators(
              required,
              maxLength(VALIDATION_LENGTH.NAMES)
            )}
            validateFields={[]}
          >
            {({ input, meta }) => (
              <FormInput label="Plural" required meta={meta} input={input} />
            )}
          </Field>
          <Field
            name="singular"
            validate={composeValidators(
              required,
              maxLength(VALIDATION_LENGTH.NAMES)
            )}
            validateFields={[]}
          >
            {({ input, meta }) => (
              <FormInput label="Singular" required meta={meta} input={input} />
            )}
          </Field>
          <FormButton
            text={`${ButtonLang.update} Diction`}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
