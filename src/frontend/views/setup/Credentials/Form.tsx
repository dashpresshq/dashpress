import {
  FormCheckBox,
  FormInput,
  FormButton,
  FormNumberInput,
  FormSelect,
} from "@hadmean/chromista";
import { Form, Field } from "react-final-form";
import { required, StringUtils } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { IDBCredentials, SupportedDatabaseTypes } from "shared/types";

const DEFAULT_DATABASE_TYPE_PORT: Record<SupportedDatabaseTypes, number> = {
  [SupportedDatabaseTypes.MySql]: 3306,
  [SupportedDatabaseTypes.Postgres]: 5432,
  [SupportedDatabaseTypes.Sqlite]: 0,
  [SupportedDatabaseTypes.MsSql]: 1433,
};

export function CredentialsSetupForm({ onSubmit }: IFormProps<IDBCredentials>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        port: DEFAULT_DATABASE_TYPE_PORT[
          Object.values(DEFAULT_DATABASE_TYPE_PORT)[0]
        ],
      }}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Field name="databaseType" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormSelect
                label="Database Type"
                selectData={Object.values(SupportedDatabaseTypes).map(
                  (databaseType) => ({
                    label: StringUtils.upperCaseFirstLetter(databaseType),
                    value: databaseType,
                  })
                )}
                meta={meta}
                input={{
                  ...input,
                  onChange: (value) => {
                    form.change("port", DEFAULT_DATABASE_TYPE_PORT[value]);
                    input.onChange(value);
                  },
                }}
              />
            )}
          </Field>
          <Field name="user" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="User" meta={meta} input={input} />
            )}
          </Field>
          <Field name="password" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput
                label="Password"
                type="password"
                meta={meta}
                input={input}
              />
            )}
          </Field>

          <Field name="database" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Database" meta={meta} input={input} />
            )}
          </Field>

          <Field name="host" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Host" meta={meta} input={input} />
            )}
          </Field>

          <Field name="port" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormNumberInput label="Port" meta={meta} input={input} />
            )}
          </Field>

          <Field name="ssl" validateFields={[]} type="checkbox">
            {({ input, meta }) => (
              <FormCheckBox label="Use SSL" meta={meta} input={input} />
            )}
          </Field>

          <FormButton
            text="Setup Credentials"
            isMakingRequest={submitting}
            disabled={pristine}
            block
          />
        </form>
      )}
    />
  );
}
