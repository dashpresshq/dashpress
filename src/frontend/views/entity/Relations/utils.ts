export const getFieldsOffFormat = (format: string): string[] => {
  if (!format) {
    return [];
  }
  return [...(format.match(/[^{{}]+(?=}})/g) || [])].map((field) =>
    field.trim()
  );
};
