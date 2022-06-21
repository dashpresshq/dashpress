export const validateEnumNameFromRequest = (input: Record<string, unknown>) => {
  const name = input.name as string;
  if (!name) {
    return name;
  }
  // TODO schema validations that the enum exists in schema
  return name;
};
