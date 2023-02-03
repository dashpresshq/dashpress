export enum QueryOperators {
  EQUAL_TO = "EQUAL_TO",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  CONTAINS = "CONTAINS",
  IN = "IN",
  NOT_EQUAL = "NOT_EQUAL",
  NOT_IN = "NOT_IN",
  BETWEEN = "BETWEEN",
}

export type QueryOperationImplementation<T> = Record<
  QueryOperators,
  (query: T, column: string, value: unknown) => T
>;
