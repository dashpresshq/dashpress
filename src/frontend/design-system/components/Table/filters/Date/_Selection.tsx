import {
  DATE_FILTER_OPTIONS,
  IColumnFilterBag,
  IDateFilterOption,
} from "@hadmean/protozoa";
import React from "react";
import { SimpleSelect } from "../../../Form/FormSelect/Simple";
import { Stack } from "../../../../primitives";

const getOptionValue = (value: string) => {
  const dateOption = DATE_FILTER_OPTIONS.find(
    (option) => option.value === value
  );
  return dateOption?.countLimit ? `1:${value}` : value;
};

const getFilterValue = (filterValue: string) => {
  if (!filterValue.includes(":")) {
    return filterValue;
  }
  return filterValue.split(":")[1];
};

const setCountValue = (countValue: string, filterValue: string) => {
  const value = filterValue.split(":")[1];
  return `${countValue}:${value}`;
};

const getCountValue = (filterValue: string) => {
  const [value] = filterValue.split(":");
  return value;
};

const getOptionCountLimit = (filterValue: string) => {
  const value = filterValue.split(":")[1];
  const dateOption = DATE_FILTER_OPTIONS.find(
    (option) => option.value === value
  );
  return dateOption?.countLimit || 1;
};

interface IProps {
  filterValue?: IColumnFilterBag<string>;
  setFilter: (value: IColumnFilterBag<string> | undefined) => void;
  field: "value" | "value2";
  defaultValue: string;
  dateOptions: IDateFilterOption[];
}

export function DateSelection({
  filterValue,
  setFilter,
  field,
  defaultValue,
  dateOptions,
}: IProps) {
  const currentFilterValue = filterValue?.[field] || "";
  const hasCountValue = currentFilterValue?.includes(":");
  return (
    <Stack>
      {hasCountValue && (
        <SimpleSelect
          options={Array.from(
            { length: getOptionCountLimit(currentFilterValue) },
            (_, k) => `${k + 1}`
          ).map((count) => ({ label: count, value: count }))}
          onChange={(value) => {
            setFilter({
              ...filterValue,
              [field]: setCountValue(value, currentFilterValue),
            });
          }}
          value={getCountValue(currentFilterValue) || "1"}
        />
      )}
      <SimpleSelect
        options={dateOptions.map(({ value, label }) => ({ label, value }))}
        fullWidth
        onChange={(value) => {
          setFilter({
            ...filterValue,
            [field]: getOptionValue(value),
          });
        }}
        value={getFilterValue(currentFilterValue || defaultValue)}
      />
    </Stack>
  );
}
