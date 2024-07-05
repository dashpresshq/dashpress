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
  IS_NOT_NULL = "IS_NOT_NULL",
}

type QueryOperatorsFnType<T> = (query: T, column: string, value: unknown) => T;

export type QueryOperationImplementation<T> = Record<
  "or" | "and",
  Record<QueryOperators, QueryOperatorsFnType<T>>
>;
