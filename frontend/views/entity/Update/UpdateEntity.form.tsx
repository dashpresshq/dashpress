import { FormButton } from "@gothicgeeks/design-system";
import { ButtonLang } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
  runValidationError,
} from "../_RenderFormInput";

export const UpdateEntityForm: React.FC<
  IBaseEntityForm & {
    initialValues?: Record<string, unknown>;
  } & IEntityFormSettings
> = ({
  onSubmit,
  initialValues,
  fields,
  entityFieldTypes,
  entityValidationsMap,
  getEntityFieldLabels,
}) => {
  return (
    <Form
      // TODO Send only changed fields
      onSubmit={onSubmit}
      validate={runValidationError(fields, entityValidationsMap)}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => {
        return (
          <form noValidate={true} onSubmit={handleSubmit}>
            {fields.map((name) => {
              return (
                <Field key={name} name={name} validateFields={[]}>
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
            <FormButton text={ButtonLang.update} isMakingRequest={submitting} />
          </form>
        );
      }}
    />
  );
};
