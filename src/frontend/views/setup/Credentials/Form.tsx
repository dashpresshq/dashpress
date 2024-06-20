import { Form, Field } from "react-final-form";
import {
  IDataSourceCredentials,
  DATA_SOURCES_CONFIG,
} from "shared/types/data-sources";
import { upperCaseFirstLetter } from "shared/lib/strings";
import { required } from "frontend/lib/validations";
import { IFormProps } from "frontend/lib/form/types";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotKeys } from "shared/lib/objects";
import { FormButton } from "@/components/app/button/form";
import { FormInput } from "@/components/app/form/input/text";
import { FormSwitch } from "@/components/app/form/input/switch";
import { FormNumberInput } from "@/components/app/form/input/number";
import { FormSelect } from "@/components/app/form/input/select";

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
                  label={msg`Database Type`}
                  selectData={typescriptSafeObjectDotKeys(
                    DATA_SOURCES_CONFIG
                  ).map((dataSourceType) => ({
                    label: msg`${upperCaseFirstLetter(dataSourceType)}`,
                    value: dataSourceType,
                  }))}
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
                            label: msg`Toggle Connection URL`,
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
                  <FormInput
                    label={msg`Connection URL`}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            ) : (
              <>
                {dataSourceConfig.fields.includes("host") && (
                  <Field name="host" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput label={msg`Host`} meta={meta} input={input} />
                    )}
                  </Field>
                )}
                {dataSourceConfig.fields.includes("user") && (
                  <Field name="user" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput label={msg`User`} meta={meta} input={input} />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("password") && (
                  <Field name="password" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput
                        label={msg`Password`}
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
                      <FormInput
                        label={msg`Database`}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                )}
                {dataSourceConfig.fields.includes("port") && (
                  <Field name="port" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormNumberInput
                        label={msg`Port`}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("ssl") && (
                  <Field name="ssl" validateFields={[]} type="checkbox">
                    {({ input }) => (
                      <FormSwitch
                        label={msg`Use SSL`}
                        value={input.value}
                        onChange={input.onChange}
                        name={input.name}
                        disabled={input.disabled}
                      />
                    )}
                  </Field>
                )}

                {dataSourceConfig.fields.includes("filename") && (
                  <Field name="filename" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput
                        label={msg`File Name`}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                )}
              </>
            )}

            <FormButton
              text={(isSubmitting) =>
                isSubmitting
                  ? msg`Setting Up Credentials`
                  : msg`Setup Credentials`
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
