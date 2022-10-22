export const matchOtherField = (
  value: unknown,
  parameter?: unknown,
  allValues?: Record<string, unknown>
) => {
  return value === allValues[parameter as string];
};

export const lessThanOtherField = (
  value: unknown,
  parameter?: unknown,
  allValues?: Record<string, unknown>
) => {
  return value < allValues[parameter as string];
};

export const greaterThanOtherField = (
  value: unknown,
  parameter?: unknown,
  allValues?: Record<string, unknown>
) => {
  return value > allValues[parameter as string];
};

export const doesntMatchOtherField = (
  value: unknown,
  parameter?: unknown,
  allValues?: Record<string, unknown>
) => {
  return value !== allValues[parameter as string];
};
