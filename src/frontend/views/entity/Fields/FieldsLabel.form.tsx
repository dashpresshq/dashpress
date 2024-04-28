import { Form, Field } from "react-final-form";
import {
  minLength,
  composeValidators,
  maxLength,
} from "frontend/lib/validations";
import { ICrudConfig } from "frontend/lib/crud-config";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { i18nNoop } from "translations/fake";

interface IProps {
  fields: string[];
  initialValues?: Record<string, string>;
  crudConfig: ICrudConfig;
  onSubmit: (data: Record<string, string>) => void;
}

export const loadingFieldsLabelForm = (
  <FormSkeleton
    schema={[
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
    ]}
  />
);

export function FieldsLabelForm({
  onSubmit,
  initialValues,
  fields,
  crudConfig,
}: IProps) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <Field
              key={field}
              name={field}
              validate={composeValidators(minLength(2), maxLength(64))}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <FormInput label={i18nNoop(field)} input={input} meta={meta} />
              )}
            </Field>
          ))}
          <FormButton
            text={crudConfig.FORM_LANG.UPSERT}
            isMakingRequest={submitting}
            disabled={pristine}
            systemIcon="Save"
          />
        </form>
      )}
    />
  );
}
