import { evalJavascriptStringSafely } from "shared/lib/script-runner";
import { IEvaluateScriptContext } from "shared/types/forms";

export type IPresentationScriptParams = {
  row: Record<string, unknown>;
  value: unknown;
  field: string;
  from: "details" | "table";
} & IEvaluateScriptContext;

export const evalutePresentationScript = (
  script: string,
  { field, from, row, value }: IPresentationScriptParams
) => {
  if (!script) {
    return value;
  }

  const response = evalJavascriptStringSafely(script, {
    field,
    from,
    row,
    value,
  });

  if (!response) {
    return value;
  }

  return response;
};
