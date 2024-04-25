import { typescriptSafeObjectDotEntries } from "shared/lib/objects";

export const queryObjectToQueryString = (
  queryObject?: Record<string, string>
): string => {
  if (!queryObject) {
    return "";
  }
  const querystring = typescriptSafeObjectDotEntries(queryObject)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `?${querystring}`;
};
