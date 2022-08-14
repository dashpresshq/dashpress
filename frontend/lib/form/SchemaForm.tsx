import { FormButton } from "@gothicgeeks/design-system";
import { resetFormValues } from "@gothicgeeks/shared";
import { Field, Form } from "react-final-form";
import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas";
import { runValidationError } from "shared/validations/run";
import { useRouter } from "next/router";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { RenderFormInput } from "./_RenderFormInput";
import { userFriendlyCase } from "../strings";
import { IFormCustomization } from "./types";

const runJavascriptString = (
  javascriptString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  try {
    // eslint-disable-next-line no-new-func
    return Function("$", javascriptString)({ ...globals, ...context });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      `•Expression:'${javascriptString}'\n•JS-Error: `,
      e,
      "\n•Context: ",
      context
    );
  }
};

interface IProps<T> {
  fields: IAppliedSchemaFormConfig<T>;
  onSubmit: (data: T) => void;
  initialValues?: Partial<T>;
  buttonText: string;
  resetForm?: true;
  formCustomization?: Partial<IFormCustomization>;
}

const computeFieldState = (
  fieldStateString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  if (!fieldStateString) {
    return {};
  }
  return runJavascriptString(fieldStateString, globals, context);
};

const computeBeforeSubmit = (
  beforeSubmitString: string,
  formValue: Record<string, unknown>
) => {
  if (!beforeSubmitString) {
    return formValue;
  }
};

const computeAfterSubmit = (afterSubmitString: string) => {
  if (!afterSubmitString) {
    return {};
  }
};

const useSciptContext = () => {
  const router = useRouter();
  const authUser = useAuthenticatedUserBag();
  return {
    routeParams: router.query,
    auth: authUser.data,
  };
};

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  buttonText,
  initialValues,
  formCustomization,
  resetForm,
}: IProps<T>) {
  const scriptContext = useSciptContext();
  console.log(scriptContext);
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={runValidationError(fields)}
      render={({ handleSubmit, submitting, values, form, pristine }) => {
        const fieldState = computeFieldState(
          formCustomization?.fieldsState,
          scriptContext,
          { formValues: values }
        );
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
