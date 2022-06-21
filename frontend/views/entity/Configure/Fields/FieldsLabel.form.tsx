import { FormButton, FormInput } from "@gothicgeeks/design-system";
import { IEntityField } from "../../../../../backend/entities/types";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@gothicgeeks/shared";

export const FieldsLabelForm: React.FC<{
  fields: IEntityField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
}> = ({ onSubmit, initialValues, fields }) => {
  return (
    <Form
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
                  validate={composeValidators(minLength(2), maxLength(64))}
                  validateFields={[]}
                >
                  {(renderProps) => <FormInput label={name} {...renderProps} />}
                </Field>
              );
            })}
            <FormButton text={ButtonLang.upsert} isMakingRequest={submitting} />
          </form>
        );
      }}
    />
  );
};
