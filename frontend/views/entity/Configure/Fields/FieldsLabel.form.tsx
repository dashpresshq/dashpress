import {
  FormButton,
  FormInput,
  FormSkeleton,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@gothicgeeks/shared";
import { IEntityField } from "../../../../../backend/entities/types";

interface IProps {
  fields: IEntityField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function FieldsLabelForm({
  isLoading,
  onSubmit,
  initialValues,
  fields,
}: IProps) {
  if (isLoading) {
    return (
      <FormSkeleton
        schema={[
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Textarea,
        ]}
      />
    );
  }
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          {fields.map(({ name }) => (
            <Field
              key={name}
              name={name}
              validate={composeValidators(minLength(2), maxLength(64))}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <FormInput label={name} input={input} meta={meta} />
              )}
            </Field>
          ))}
          <FormButton
            text={ButtonLang.upsert}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
