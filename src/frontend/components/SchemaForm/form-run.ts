import { evalJavascriptStringSafely } from "frontend/lib/script-runner";
import { ISchemaFormScriptProps } from "./types";

export const runFormFieldState = <T>(
  fieldStateString: string,
  scriptProps: ISchemaFormScriptProps<T>
) => {
  if (!fieldStateString) {
    return {};
  }

  const response = evalJavascriptStringSafely(
    fieldStateString,
    scriptProps as unknown as Record<string, unknown>
  );

  if (typeof response !== "object") {
    return {};
  }
  return response;
};

export const runFormBeforeSubmit = <T>(
  beforeSubmitString: string,
  scriptProps: ISchemaFormScriptProps<T>
) => {
  if (!beforeSubmitString) {
    return scriptProps.formValues;
  }
  const response = evalJavascriptStringSafely(
    beforeSubmitString,
    scriptProps as unknown as Record<string, unknown>
  );

  if (!response) {
    return scriptProps.formValues;
  }

  return response;
};
