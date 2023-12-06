import { Field, Form } from "react-final-form";
import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import { runValidationError } from "shared/validations/run";
import { ToastService } from "frontend/lib/toast";
import { resetFormValues } from "frontend/lib/form/utils";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { ButtonIconTypes } from "frontend/design-system/components/Button/constants";
import { RenderFormInput } from "./_RenderFormInput";
import { IFormExtension } from "./types";
import { runFormBeforeSubmit, runFormFieldState } from "./form-run";
import { useSchemaFormScriptContext } from "./useSchemaFormScriptContext";

interface IProps<T> {
  fields: IAppliedSchemaFormConfig<T>;
  onSubmit: (data: T) => Promise<void | T>;
  initialValues?: Partial<T>;
  buttonText?: (submitting: boolean) => string;
  action?: string;
  icon: ButtonIconTypes | "no-icon";
  onChange?: (data: T) => void;
  resetForm?: true;
  formExtension?: Partial<IFormExtension>;
}

// TODO: dependent options for schema forms

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  onChange,
  buttonText,
  initialValues,
  icon,
  action,
  formExtension,
  resetForm,
}: IProps<T>) {
  const scriptContext = useSchemaFormScriptContext(action);

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
        > = runFormFieldState(
          formExtension?.fieldsState,
          scriptContext,
          values
        );

        return (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                resetFormValues<Record<string, unknown>>(
                  resetForm,
                  values,
                  form as any,
                  initialValues
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
                      placeholder={bag.placeholder}
                      description={bag.description}
                      apiSelections={bag.apiSelections}
                      label={bag.label || userFriendlyCase(field)}
                      entityFieldSelections={bag.selections}
                      renderProps={renderProps}
                    />
                  )}
                </Field>
              ))}
            {buttonText && (
              <FormButton
                text={buttonText}
                isMakingRequest={submitting}
                disabled={pristine}
                icon={icon === "no-icon" ? undefined : icon}
              />
            )}
          </form>
        );
      }}
    />
  );
}
