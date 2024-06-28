import { Field, Form } from "react-final-form";
import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import { runValidationError } from "shared/validations/run";
import { resetFormValues } from "frontend/lib/form/utils";
import { SystemIconsKeys } from "shared/constants/Icons";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { MessageDescriptor } from "@lingui/core";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { msg } from "@lingui/macro";
import { FormButton } from "@/components/app/button/form";
import { RenderFormInput } from "./_RenderFormInput";
import { IFormExtension } from "./types";
import { runFormBeforeSubmit, runFormFieldState } from "./form-run";
import { FormGrid } from "./form-grid";
import { useToast } from "../../toast/use-toast";

const identity = (value: unknown) => value;

interface IProps<T> {
  fields: IAppliedSchemaFormConfig<T>;
  onSubmit: (data: T) => Promise<unknown>;
  initialValues?: Partial<T>;
  buttonText?: (submitting: boolean) => MessageDescriptor;
  action?: string;
  systemIcon: SystemIconsKeys;
  onChange?: (data: T) => void;
  resetForm?: true;
  formExtension?: Partial<IFormExtension>;
  from?: string;
}

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  onChange,
  buttonText,
  initialValues,
  systemIcon,
  action,
  formExtension,
  resetForm,
  from,
}: IProps<T>) {
  const evaluateScriptContext = useEvaluateScriptContext();
  const { toast } = useToast();
  const scriptContext = {
    action,
    ...evaluateScriptContext,
  };

  return (
    <Form
      onSubmit={async (formValues) => {
        const modifiedFormValues = runFormBeforeSubmit(
          formExtension?.beforeSubmit,
          { ...scriptContext, formValues }
        );

        if (typeof modifiedFormValues !== "object") {
          toast({
            description: modifiedFormValues,
            variant: "red",
            title: msg`Input Validation`,
          });
          return;
        }

        await onSubmit(modifiedFormValues);
      }}
      initialValues={initialValues}
      validate={runValidationError(fields)}
      render={({ handleSubmit, submitting, values, form, pristine }) => {
        const scriptProps = {
          ...scriptContext,
          formValues: values as T,
        };
        onChange?.(values as T);
        const fieldState: Record<
          string,
          { hidden: boolean; disabled: boolean }
        > = runFormFieldState(formExtension?.fieldsState, scriptProps);

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
            <FormGrid.Root>
              {typescriptSafeObjectDotEntries(fields)
                .filter(([field, bag]) => {
                  const isHidden = fieldState[String(field)]?.hidden;
                  if (isHidden) {
                    return false;
                  }
                  return !bag?.formState?.(scriptProps).hidden;
                })
                .map(([field, bag]: [string, ISchemaFormConfig<T>]) => (
                  <Field
                    key={field}
                    name={field}
                    validateFields={[]}
                    parse={identity}
                  >
                    {(formProps) => (
                      <FormGrid.Item span={bag.span}>
                        <RenderFormInput
                          type={bag.type}
                          disabled={
                            fieldState[field]?.disabled ||
                            bag?.formState?.(scriptProps).disabled
                          }
                          required={bag.validations.some(
                            (validation) =>
                              validation.validationType === "required"
                          )}
                          form={form}
                          rightActions={bag?.rightActions}
                          placeholder={bag.placeholder}
                          onChange={bag.onChange}
                          description={bag.description}
                          apiSelections={bag.apiSelections}
                          label={bag.label}
                          entityFieldSelections={bag.selections}
                          formProps={formProps}
                          from={from}
                        />
                      </FormGrid.Item>
                    )}
                  </Field>
                ))}
            </FormGrid.Root>
            {buttonText && (
              <FormButton
                text={buttonText}
                isMakingRequest={submitting}
                disabled={pristine}
                systemIcon={systemIcon}
              />
            )}
          </form>
        );
      }}
    />
  );
}
