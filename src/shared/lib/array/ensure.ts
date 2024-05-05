export const ensureIsArray = (data: string | string[]): string[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return [data];
};
