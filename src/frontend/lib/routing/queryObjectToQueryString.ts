import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";

export function objectToQueryParams(
  data?: Record<string, undefined | string | string[] | number | number[]>,
  includePrefix = true
) {
  const params = new URLSearchParams();

  typescriptSafeObjectDotEntries(data || {}).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item: string | number) =>
        params.append(key, String(item))
      );
    } else {
      params.append(key, String(value));
    }
  });

  if (params.toString() === "") {
    return "";
  }

  return (includePrefix ? "?" : "") + params.toString();
}
