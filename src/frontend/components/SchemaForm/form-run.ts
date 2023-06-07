import { evalJavascriptStringSafely } from "frontend/lib/script-runner";

export type ISchemaFormScriptParams = Record<string, unknown> & {
  formValues: Record<string, unknown>;
};

export const runFormFieldState = (
  fieldStateString: string,
  scriptContext: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  if (!fieldStateString) {
    return {};
  }

  const response = evalJavascriptStringSafely<ISchemaFormScriptParams>(
    fieldStateString,
    {
      ...scriptContext,
      formValues,
    }
  );

  if (typeof response !== "object") {
    return {};
  }
  return response;
};

export const runFormBeforeSubmit = (
  beforeSubmitString: string,
  scriptContext: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  if (!beforeSubmitString) {
    return formValues;
  }
  const response = evalJavascriptStringSafely<ISchemaFormScriptParams>(
    beforeSubmitString,
    {
      ...scriptContext,
      formValues,
    }
  );

  if (!response) {
    return formValues;
  }

  return response;
};
