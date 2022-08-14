export const runJavascriptString = (
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

// TODO
export const runAsyncJavascriptString = async (
  javascriptString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
) => {
  const AsyncFunction = async function X() {}.constructor;
  try {
    // eslint-disable-next-line no-new-func
    return await AsyncFunction(
      "$",
      javascriptString
    )({
      ...globals,
      ...context,
    });
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

export const runFormAfterSubmit = async (
  afterSubmitString: string,
  globals: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<void> => {
  if (!afterSubmitString) {
    return;
  }
  await runAsyncJavascriptString(afterSubmitString, globals, context);
};
