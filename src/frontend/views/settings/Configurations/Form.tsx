import { FormButton, FormInput } from "@hadmean/chromista";
import { IFormProps, required } from "@hadmean/protozoa";
import { Field, Form } from "react-final-form";

export function KeyValueForm({
  onSubmit,
  initialValues,
}: IFormProps<Record<string, string>>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            {Object.entries(values).map(([key]) => (
              <Field
                name={key}
                key={key}
                validate={required}
                validateFields={[]}
              >
                {({ input, meta }) => (
                  <FormInput
                    label={key}
                    rightActions={[
                      {
                        action: () => {},
                        label: "Remove",
                      },
                    ]}
                    meta={meta}
                    input={{
                      ...input,
                      onChange: (value) => {
                        input.onChange(value);
                      },
                    }}
                  />
                )}
              </Field>
            ))}

            <FormButton
              text="Save Changes"
              isMakingRequest={submitting}
              disabled={pristine}
            />
          </form>
        );
      }}
    />
  );
}
