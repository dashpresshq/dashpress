import type { Knex } from "knex";
import type { MessageDescriptor } from "@lingui/core";
import type { ISystemStatusForDisplay } from "./options";

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
  IS_NOT_NULL = "o",
}

export enum DataEventActions {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export interface IColumnFilterBag<T> {
  operator?: FilterOperators;
  value?: T;
  value2?: T;
}

export interface IDateFilterOption {
  label: MessageDescriptor;
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

export type TableFilterType =
  | { _type: "boolean"; bag: ISystemStatusForDisplay[] }
  | { _type: "date"; bag: undefined }
  | { _type: "idField"; bag: undefined }
  | { _type: "number"; bag: undefined }
  | { _type: "string"; bag: undefined }
  | { _type: "status"; bag: ISystemStatusForDisplay[] }
  | {
      _type: "list";
      bag: string;
    };

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
  modifyQuery?: (queryBuilder: Knex.QueryBuilder) => Knex.QueryBuilder;
};

export type ITableView = {
  id: string;
  title: string;
  dataState: Pick<
    IPaginatedDataState<unknown>,
    "filters" | "sortBy" | "pageSize"
  >;
};

export type DataCrudKeys = "create" | "update" | "table" | "details";
