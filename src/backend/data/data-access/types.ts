export enum QueryOperators {
  EQUAL_TO = "EQUAL_TO",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  CONTAINS = "CONTAINS",
  IN = "IN",
  NOT_EQUAL = "NOT_EQUAL",
  NOT_IN = "NOT_IN",
  BETWEEN = "BETWEEN",
  IS_NULL = "IS_NULL",
}

export type QueryOperationImplementation<T> = Record<
  "or" | "and",
  Record<QueryOperators, (query: T, column: string, value: unknown) => T>
>;
