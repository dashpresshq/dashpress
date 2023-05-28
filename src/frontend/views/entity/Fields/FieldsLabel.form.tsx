import {
  FormButton,
  FormInput,
  FormSkeleton,
  FormSkeletonSchema,
} from "@hadmean/chromista";
import { Form, Field } from "react-final-form";
import { composeValidators, maxLength, minLength } from "@hadmean/protozoa";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";

interface IProps {
  fields: string[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
}

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_columns_labels");

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

export function FieldsLabelForm({ onSubmit, initialValues, fields }: IProps) {
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
                <FormInput label={field} input={input} meta={meta} />
              )}
            </Field>
          ))}
          <FormButton
            text={CRUD_CONFIG.FORM_LANG.UPSERT(false)}
            loadingText={CRUD_CONFIG.FORM_LANG.UPSERT(true)}
            isMakingRequest={submitting}
            disabled={pristine}
            icon="save"
          />
        </form>
      )}
    />
  );
}
