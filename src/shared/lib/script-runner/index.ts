/* eslint-disable no-console */
export function evalJavascriptString(
  javascriptString: string,
  context: Record<string, unknown>
) {
  /* eslint-disable no-new-func */
  return Function("$", javascriptString)(context);
}

export function evalJavascriptStringSafely(
  javascriptString: string,
  context: Record<string, unknown>
) {
  try {
    return evalJavascriptString(javascriptString, context);
  } catch (e) {
    console.warn(
      `•Expression:'${javascriptString}'\n•JS-Error: `,
      e,
      "\n•Context: ",
      context
    );
  }
}
