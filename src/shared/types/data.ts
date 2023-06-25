export enum FilterOperators {
  GREATER_THAN = "g",
  LESS_THAN = "l",
  EQUAL_TO = "e",
  CONTAINS = "c",
  NOT_EQUAL = "n",

  NOT_IN = "t",
  BETWEEN = "b",
  DATE = "d",
  IN = "i",

  IS_NULL = "s",
}

export interface IColumnFilterBag<T> {
  operator?: FilterOperators;
  value?: T;
  value2?: T;
}

export interface IDateFilterOption {
  label: string;
  value: string;
  hideOnFrom?: true;
  hideOnTo?: true;
  countLimit?: number;
}

export enum DATE_FILTER_VALUE {
  BEGINNING_OF_TIME_VALUE = "bt",
  BEGINNING_OF_YEAR = "by",
  NOW = "n",
  HOUR = "h",
  DAY = "d",
  WEEK = "w",
  MONTH = "m",
  QUARTER = "q",
  YEAR = "y",
}

export type FieldQueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export type OrderValue = {
  id: string;
  desc: boolean;
};

export type PaginatedData<T> = {
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  data: T[];
};

export type IPaginatedDataState<T> = {
  pageIndex: number;
  pageSize?: number;
  sortBy?: OrderValue[];
  filters?: Record<string, T>[];
};

export type QueryFilterSchema = {
  operator: "and" | "or";
  children: Array<FieldQueryFilter | QueryFilterSchema>;
};

export type ITableTab = {
  id: string;
  title: string;
  dataState: Pick<
    IPaginatedDataState<unknown>,
    "filters" | "sortBy" | "pageSize"
  >;
};

export const FOR_CODE_COV = 1;

export type DataCrudKeys = "create" | "update" | "table" | "details";
