/* eslint-disable no-console */
export const evalJSFormScript = (
  javascriptString: string,
  scriptContext: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  /* eslint-disable no-new-func */
  return Function("$", javascriptString)({ ...scriptContext, formValues });
};

export const runJavascriptString = (
  javascriptString: string,
  scriptContext: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  try {
    return evalJSFormScript(javascriptString, scriptContext, formValues);
  } catch (e) {
    console.warn(
      `•Expression:'${javascriptString}'\n•JS-Error: `,
      e,
      "\n•Context: ",
      formValues
    );
  }
};

// export const runAsyncJavascriptString = async (
//   javascriptString: string,
//   scriptContext: Record<string, unknown>,
//   context: Record<string, unknown>
// ) => {
//   const AsyncFunction = async function X() {}.constructor;
//   try {
//     return await AsyncFunction(
//       "$",
//       javascriptString
//     )({
//       ...scriptContext,
//       ...context,
//     });
//   } catch (e) {
//     console.warn(
//       `•Expression:'${javascriptString}'\n•JS-Error: `,
//       e,
//       "\n•Context: ",
//       context
//     );
//   }
// };

export const runFormFieldState = (
  fieldStateString: string,
  scriptContext: Record<string, unknown>,
  formValues: Record<string, unknown>
) => {
  if (!fieldStateString) {
    return {};
  }
  const response = runJavascriptString(
    fieldStateString,
    scriptContext,
    formValues
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
  const response = runJavascriptString(
    beforeSubmitString,
    scriptContext,
    formValues
  );

  if (!response) {
    return formValues;
  }

  return response;
};
