import { FormButton } from "@gothicgeeks/design-system";
import { resetFormValues, ToastService } from "@gothicgeeks/shared";
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
  onSubmit: (data: T) => Promise<void>;
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
  const response = runJavascriptString(fieldStateString, globals, context);
  if (typeof response !== "object") {
    return {}; // :eyes on this check
  }
  return response;
};

const computeBeforeSubmit = (
  beforeSubmitString: string,
  globals: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  if (!beforeSubmitString) {
    return formValues;
  }
  const response = runJavascriptString(beforeSubmitString, globals, {
    formValues,
  });
  return response;
};

const computeAfterSubmit = async (
  afterSubmitString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<void> => {
  if (!afterSubmitString) {
    return;
  }
  runJavascriptString(afterSubmitString, globals, context);
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
  return (
    <Form
      onSubmit={async (formValues) => {
        const modifiedFormValues = computeBeforeSubmit(
          formCustomization?.beforeSubmit,
          scriptContext,
          formValues
        );
        if (typeof modifiedFormValues !== "object") {
          ToastService.error(modifiedFormValues);
          return;
        }

        await onSubmit(modifiedFormValues);

        await computeAfterSubmit(
          formCustomization?.afterSubmit,
          scriptContext,
          formValues
        );
      }}
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
