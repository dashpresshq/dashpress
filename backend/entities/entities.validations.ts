export const validateEntityFromRequest = (input: Record<string, unknown>) => {
  const entity = input.entity as string;
  if (!entity) {
    return entity;
  }
  // TODO schema validations that the entity exists in schema
  return entity;
};

// This needs to go through some validation, uuid, integer,
export const validateEntityIdFromRequest = (input: Record<string, unknown>) =>
  input.id as string;
