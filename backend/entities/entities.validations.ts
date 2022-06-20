export const validateEntityFromRequest = (input: Record<string, unknown>) => {
  const entity = input.entity as string;
  if (!entity) {
    return entity;
  }
  // TODO schema validations that the entity exists in schema
  return entity;
};

export const validateEntityIdFromRequest = (input: Record<string, unknown>) => {
  // This needs to go through some validation, uuid, integer,
  return input.id as string;
};
