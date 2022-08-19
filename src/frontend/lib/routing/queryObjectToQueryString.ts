export const queryObjectToQueryString = (
  queryObject?: Record<string, string>
): string => {
  if (!queryObject) {
    return "";
  }
  const querystring = Object.entries(queryObject)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `?${querystring}`;
};
