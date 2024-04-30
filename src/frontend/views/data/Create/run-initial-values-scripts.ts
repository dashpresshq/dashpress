import { evalJavascriptStringSafely } from "shared/lib/script-runner";

export const runInitialValuesScript = (
  initialValuesScript: string,
  context: Record<string, unknown>
): Record<string, unknown> => {
  if (!initialValuesScript) {
    return {};
  }

  const response = evalJavascriptStringSafely(initialValuesScript, context);

  if (typeof response !== "object") {
    return {};
  }
  return response;
};
