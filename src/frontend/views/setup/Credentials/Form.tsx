import { Form, Field } from "react-final-form";
import {
  IDataSourceCredentials,
  DATA_SOURCES_CONFIG,
} from "shared/types/data-sources";
import { upperCaseFirstLetter } from "shared/lib/strings";
import { required } from "frontend/lib/validations";
import { IFormProps } from "frontend/lib/form/types";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { FormNumberInput } from "frontend/design-system/components/Form/FormNumberInput";
import { FormCheckBox } from "frontend/design-system/components/Form/FormCheckBox";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { FormSelect } from "frontend/design-system/components/Form/FormSelect";
import { useToggle } from "frontend/hooks/state/useToggleState";

export function CredentialsSetupForm({
  onSubmit,
}: IFormProps<IDataSourceCredentials>) {
  const connectionStringView = useToggle();
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        port: Object.values(DATA_SOURCES_CONFIG)[0].port,
      }}
      render={({ handleSubmit, submitting, pristine, form, values }) => {
        const dataSourceConfig = DATA_SOURCES_CONFIG[values.dataSourceType] || {
          fields: [],
          useConnectionString: false,
        };
        return (
          <form onSubmit={handleSubmit}>
            <Field
              name="dataSourceType"
              validate={required}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <FormSelect
                  label="Database Type"
                  selectData={Object.keys(DATA_SOURCES_CONFIG).map(
                    (dataSourceType) => ({
                      label: upperCaseFirstLetter(dataSourceType),
                      value: dataSourceType,
                    })
                  )}
                  rightActions={
                    dataSourceConfig.useConnectionString
                      ? [
                          {
                            systemIcon: connectionStringView.isOn
                              ? "ToggleLeft"
                              : "ToggleRight",
                            action: () => {
                              connectionStringView.toggle();
                            },
                            label: "Toggle Connection URL",
                          },
                        ]
                      : []
                  }
                  meta={meta}
                  input={{
                    ...input,
                    onChange: (value) => {
                      connectionStringView.off();
                      form.change("port", DATA_SOURCES_CONFIG[value]?.port);
                      input.onChange(value);
                    },
                  }}
                />
              )}
            </Field>
            {connectionStringView.isOn ? (
              <Field
                name="connectionString"
                validate={required}
                validateFields={[]}
              >
                {({ input, meta }) => (
                  <FormInput label="Connection URL" meta={meta} input={input} />
                )}
              </Field>
            ) : (
              <>
                {dataSourceConfig.fields.includes("host") && (
                  <Field name="host" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput label="Host" meta={meta} input={input} />
                    )}
                  </Field>
                )}
                {dataSourceConfig.fields.includes("user") && (
                  <Field name="user" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput label="User" meta={meta} input={input} />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("password") && (
                  <Field name="password" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput
                        label="Password"
                        type="password"
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                )}
                {dataSourceConfig.fields.includes("database") && (
                  <Field
                    name="database"
                    validate={required}
                    validateFields={[]}
                  >
                    {({ input, meta }) => (
                      <FormInput label="Database" meta={meta} input={input} />
                    )}
                  </Field>
                )}
                {dataSourceConfig.fields.includes("port") && (
                  <Field name="port" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormNumberInput label="Port" meta={meta} input={input} />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("ssl") && (
                  <Field name="ssl" validateFields={[]} type="checkbox">
                    {({ input, meta }) => (
                      <FormCheckBox label="Use SSL" meta={meta} input={input} />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("filename") && (
                  <Field name="filename" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput label="File Name" meta={meta} input={input} />
                    )}
                  </Field>
                )}
              </>
            )}

            <FormButton
              text={(isSubmitting) =>
                isSubmitting ? "Setting Up Credentials" : "Setup Credentials"
              }
              systemIcon="LogIn"
              isMakingRequest={submitting}
              disabled={pristine}
            />
          </form>
        );
      }}
    />
  );
}
