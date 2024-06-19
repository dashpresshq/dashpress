import { IColumnFilterBag, IDateFilterOption } from "shared/types/data";
import { i18nNoop } from "translations/fake";
import { msg } from "@lingui/macro";
import { DATE_FILTER_OPTIONS } from "./constants";
import { Select } from "@/components/ui/select";

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
    <>
      {hasCountValue && (
        <Select
          placeholder={msg`Select Count`}
          name="select-count"
          options={Array.from(
            { length: getOptionCountLimit(currentFilterValue) },
            (_, k) => `${k + 1}`
          ).map((count) => ({ label: i18nNoop(count), value: count }))}
          onChange={(value) => {
            setFilter({
              ...filterValue,
              [field]: setCountValue(value, currentFilterValue),
            });
          }}
          className="w-12"
          value={getCountValue(currentFilterValue) || "1"}
        />
      )}
      <Select
        placeholder={msg`Select Date Option`}
        name="select-option"
        options={dateOptions.map(({ value, label }) => ({ label, value }))}
        className="w-full"
        onChange={(value) => {
          setFilter({
            ...filterValue,
            [field]: getOptionValue(value),
          });
        }}
        value={getFilterValue(currentFilterValue || defaultValue)}
      />
    </>
  );
}
