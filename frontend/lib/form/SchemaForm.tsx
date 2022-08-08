import { FormButton } from "@gothicgeeks/design-system";
import { resetFormValues } from "@gothicgeeks/shared";
import { Field, Form } from "react-final-form";
import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas";
import { runValidationError } from "shared/validations/run";
import { RenderFormInput } from "./_RenderFormInput";
import { userFriendlyCase } from "../strings";

interface IProps<T> {
  fields: IAppliedSchemaFormConfig<T>;
  onSubmit: (data: T) => void;
  initialValues?: Partial<T>;
  buttonText: string;
  resetForm?: true;
  fieldState?: Partial<
    Record<
      keyof T,
      {
        disabled?: boolean;
        hidden?: boolean;
      }
    >
  >;
}

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  buttonText,
  initialValues,
  fieldState = {},
  resetForm,
}: IProps<T>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={runValidationError(fields)}
      render={({ handleSubmit, submitting, values, form, pristine }) => (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e)?.then(() => {
              resetFormValues(
                resetForm,
                values as Record<string, string>,
                form as any
              );
            });
          }}
        >
          {Object.entries(fields)
            .filter(([field]) => {
              return !fieldState[field]?.hidden;
            })
            .map(([field, bag]: [string, ISchemaFormConfig]) => (
              <Field key={field} name={field} validateFields={[]}>
                {(renderProps) => (
                  <RenderFormInput
                    type={bag.type}
                    disabled={fieldState[field]?.disabled}
                    required={bag.validations.some(
                      (validation) => validation.validationType === "required"
                    )}
                    label={bag.label || userFriendlyCase(field)}
                    entityFieldSelections={bag.selections}
                    renderProps={renderProps}
                  />
                )}
              </Field>
            ))}
          <FormButton
            text={buttonText}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
