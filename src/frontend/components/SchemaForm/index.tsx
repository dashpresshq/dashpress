import { FormButton } from "@hadmean/chromista";
import { resetFormValues, ToastService } from "@hadmean/protozoa";
import { Field, Form } from "react-final-form";
import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import { runValidationError } from "shared/validations/run";
import { RenderFormInput } from "./_RenderFormInput";
import { userFriendlyCase } from "../../lib/strings";
import { IFormExtension } from "./types";
import { runFormBeforeSubmit, runFormFieldState } from "./form-run";
import { useGlobalScriptContext } from "./useGlobalScriptContext";

interface IProps<T> {
  fields: IAppliedSchemaFormConfig<T>;
  onSubmit: (data: T) => Promise<void>;
  initialValues?: Partial<T>;
  buttonText: string;
  action?: string;
  onChange?: (data: T) => void;
  resetForm?: true;
  formExtension?: Partial<IFormExtension>;
}

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  onChange,
  buttonText,
  initialValues,
  action,
  formExtension,
  resetForm,
}: IProps<T>) {
  const scriptContext$1 = useGlobalScriptContext();
  const scriptContext = { ...scriptContext$1, action };
  // :eyes needs finnesing
  return (
    <Form
      onSubmit={async (formValues) => {
        const modifiedFormValues = runFormBeforeSubmit(
          formExtension?.beforeSubmit,
          scriptContext,
          formValues
        );

        if (typeof modifiedFormValues !== "object") {
          ToastService.error(modifiedFormValues);
          return;
        }

        await onSubmit(modifiedFormValues);
      }}
      initialValues={initialValues}
      validate={runValidationError(fields)}
      render={({ handleSubmit, submitting, values, form, pristine }) => {
        onChange?.(values as T);
        const fieldState: Record<
          string,
          { hidden: boolean; disabled: boolean }
        > = runFormFieldState(formExtension?.fieldsState, scriptContext, {
          formValues: values,
        });

        return (
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
                      selectionUrl={bag.selectionUrl}
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
        );
      }}
    />
  );
}
