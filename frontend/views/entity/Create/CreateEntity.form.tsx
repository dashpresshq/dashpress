import { FormButton } from "@gothicgeeks/design-system";
import { ButtonLang, resetFormValues } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import { RenderFormInput, IBaseEntityForm } from "../_RenderFormInput";

export const CreateEntityForm: React.FC<IBaseEntityForm> = ({
  onSubmit,
  fields,
  getEntityFieldLabels,
  entityFieldTypes,
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, values, submitting }) => {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                resetFormValues(
                  true,
                  values as Record<string, string>,
                  form as any
                );
              });
            }}
          >
            {fields.map(({ name }) => {
              return (
                <Field
                  key={name}
                  name={name}
                  // validate={composeValidators(required, maxLength(32))}
                  validateFields={[]}
                >
                  {(renderProps) => (
                    <RenderFormInput
                      type={entityFieldTypes[name]}
                      label={getEntityFieldLabels(name)}
                      renderProps={renderProps}
                    />
                  )}
                </Field>
              );
            })}
            <FormButton text={ButtonLang.create} isMakingRequest={submitting} />
          </form>
        );
      }}
    />
  );
};

// Create new
// Settings After create go to settings/ go to table
