import {
  FormButton,
  FormInput,
  FormSkeleton,
  FormSkeletonSchema,
} from '@gothicgeeks/design-system';
import { Form, Field } from 'react-final-form';
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from '@gothicgeeks/shared';
import { IEntityField } from '../../../../../backend/entities/types';

export const FieldsLabelForm: React.FC<{
  fields: IEntityField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}> = ({
  isLoading, onSubmit, initialValues, fields,
}) => {
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
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          {fields.map(({ name }) => (
            <Field
              key={name}
              name={name}
              validate={composeValidators(minLength(2), maxLength(64))}
              validateFields={[]}
            >
              {(renderProps) => <FormInput label={name} {...renderProps} />}
            </Field>
          ))}
          <FormButton text={ButtonLang.upsert} isMakingRequest={submitting} />
        </form>
      )}
    />
  );
};
