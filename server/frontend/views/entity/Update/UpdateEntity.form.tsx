import { FormButton } from "@gothicgeeks/design-system";
import { ButtonLang } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import { RenderFormInput, IBaseEntityForm } from "../_RenderFormInput";

export const UpdateEntityForm: React.FC<
  IBaseEntityForm & {
    initialValues?: Record<string, unknown>;
  }
> = ({
  onSubmit,
  initialValues,
  fields,
  entityFieldTypes,
  getEntityFieldLabels,
}) => {
  return (
    <Form
      // TODO Send only changed fields
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
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
            <FormButton
              text={ButtonLang.update}
              isMakingRequest={submitting}
            />
          </form>
        );
      }}
    />
  );
};
