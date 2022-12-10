/* eslint-disable no-console */
/* eslint-disable no-new-func */
export const runJavascriptString = (
  javascriptString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  try {
    return Function("$", javascriptString)({ ...globals, ...context });
  } catch (e) {
    console.warn(
      `•Expression:'${javascriptString}'\n•JS-Error: `,
      e,
      "\n•Context: ",
      context
    );
  }
};

// TODO
export const runAsyncJavascriptString = async (
  javascriptString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  const AsyncFunction = async function X() {}.constructor;
  try {
    return await AsyncFunction(
      "$",
      javascriptString
    )({
      ...globals,
      ...context,
    });
  } catch (e) {
    console.warn(
      `•Expression:'${javascriptString}'\n•JS-Error: `,
      e,
      "\n•Context: ",
      context
    );
  }
};

export const runFormFieldState = (
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

export const runFormBeforeSubmit = (
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
