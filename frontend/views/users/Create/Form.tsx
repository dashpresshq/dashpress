import { FormInput, FormButton, FormSelect } from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import {
  alphaNumeric,
  ButtonLang,
  composeValidators,
  required,
  StringUtils,
} from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";
import { AccountRole } from "shared/types";

interface ICreateUserForm {
  name: string;
  username: string;
  role: AccountRole;
  password: string;
}

export function CreateUserForm({ onSubmit }: IFormProps<ICreateUserForm>) {
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

          <Field name="role" validate={required} required validateFields={[]}>
            {({ input, meta }) => (
              <FormSelect
                label="Role"
                selectData={Object.values(AccountRole).map((role) => ({
                  value: role,
                  label: StringUtils.upperCaseFirstLetter(role),
                }))}
                required
                meta={meta}
                input={input}
              />
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
            text={ButtonLang.create}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
