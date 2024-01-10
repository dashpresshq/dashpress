import { evalJavascriptStringSafely } from "frontend/lib/script-runner";

export type IPresentationScriptParams = {
  row: Record<string, unknown>;
  value: unknown;
  field: string;
  from: "details" | "table";
};

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
