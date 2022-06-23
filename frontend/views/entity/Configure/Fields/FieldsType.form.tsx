import {
  FormButton,
  FormSelect,
  FormSkeleton,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { IEntityField } from "../../../../../backend/entities/types";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@gothicgeeks/shared";
import { ENTITY_TYPES_SELECTION_BAG } from "../../../../../shared/validations.constants";

export const FieldsTypeForm: React.FC<{
  fields: IEntityField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  getEntityFieldLabels: (fieldName: string) => string;
  isLoading: boolean;
}> = ({ onSubmit, initialValues, fields, getEntityFieldLabels, isLoading }) => {
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
                  {(renderProps) => (
                    <FormSelect
                      label={"Type for `" + getEntityFieldLabels(name) + "`"}
                      selectData={Object.keys(ENTITY_TYPES_SELECTION_BAG).map(
                        (type) => ({ label: type, value: type })
                      )}
                      nullable={true}
                      {...renderProps}
                    />
                  )}
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
