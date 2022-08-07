import {
  FormInput,
  FormButton,
  FormSelect,
  FormTextArea,
} from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import { ButtonLang, required, StringUtils } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";
import { AccountRole } from "shared/types";

interface IUpdateUserForm {
  name: string;
  role: AccountRole;
  systemProfile: string;
}

export function UpdateUserForm({ onSubmit }: IFormProps<IUpdateUserForm>) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="name" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Name" meta={meta} required input={input} />
            )}
          </Field>

          <Field name="systemProfile" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              // :eyes to move to form code editor
              <FormTextArea
                label="System Profile"
                meta={meta}
                required
                input={input}
              />
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

          <FormButton
            text={ButtonLang.update}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
