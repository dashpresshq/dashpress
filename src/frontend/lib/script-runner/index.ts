/* eslint-disable no-console */
export function evalJavascriptString<T>(javascriptString: string, context: T) {
  /* eslint-disable no-new-func */
  return Function("$", javascriptString)(context);
}

export function evalJavascriptStringSafely<T>(
  javascriptString: string,
  context: T
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
