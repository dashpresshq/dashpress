import { evalJavascriptStringSafely } from "frontend/lib/script-runner";

export const runInitialValuesScript = (
  initialValuesScript: string
): Record<string, unknown> => {
  if (!initialValuesScript) {
    return {};
  }

  const response = evalJavascriptStringSafely<{}>(initialValuesScript, {});

  if (typeof response !== "object") {
    return {};
  }
  return response;
};
