import { DATE_FILTER_VALUE } from "shared/types/data";
import { msg } from "@lingui/macro";
import { MessageDescriptor } from "@lingui/core";

const DATE_FILTER_VALUE_CONFIG: Record<
  DATE_FILTER_VALUE,
  {
    singular: (value: number) => MessageDescriptor;
    plural: (value: number) => MessageDescriptor;
  }
> = {
  [DATE_FILTER_VALUE.HOUR]: {
    singular: (value) => msg`${value} Hour`,
    plural: (value) => msg`${value} Hours`,
  },
  [DATE_FILTER_VALUE.DAY]: {
    singular: (value) => msg`${value} Day`,
    plural: (value) => msg`${value} Days`,
  },
  [DATE_FILTER_VALUE.WEEK]: {
    singular: (value) => msg`${value} Week`,
    plural: (value) => msg`${value} Weeks`,
  },
  [DATE_FILTER_VALUE.MONTH]: {
    singular: (value) => msg`${value} Month`,
    plural: (value) => msg`${value} Months`,
  },
  [DATE_FILTER_VALUE.QUARTER]: {
    singular: (value) => msg`${value} Quarter`,
    plural: (value) => msg`${value} Quarters`,
  },
  [DATE_FILTER_VALUE.YEAR]: {
    singular: (value) => msg`${value} Year`,
    plural: (value) => msg`${value} Years`,
  },
  [DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE]: {
    singular: () => msg`Genesis`,
    plural: () => msg`Genesis`,
  },
  [DATE_FILTER_VALUE.BEGINNING_OF_YEAR]: {
    singular: () => msg`Start of year`,
    plural: () => msg`Start of year`,
  },
  [DATE_FILTER_VALUE.NOW]: {
    singular: () => msg`Now`,
    plural: () => msg`Now`,
  },
};

interface DateFilterOption {
  value: string;
  label: MessageDescriptor;
}

const makeDateFilterOption = (
  filterValue: DATE_FILTER_VALUE,
  value: number
): DateFilterOption => {
  if (filterValue === DATE_FILTER_VALUE.BEGINNING_OF_YEAR) {
    return { value: filterValue, label: msg`Start of year` };
  }

  return {
    label:
      value === 1
        ? DATE_FILTER_VALUE_CONFIG[filterValue].singular(value)
        : DATE_FILTER_VALUE_CONFIG[filterValue].plural(value),
    value: `${value}:${filterValue}`,
  };
};

export const DASHBOARD_RELATIVE_DAYS: DateFilterOption[] = [
  makeDateFilterOption(DATE_FILTER_VALUE.DAY, 1),
  makeDateFilterOption(DATE_FILTER_VALUE.DAY, 3),
  makeDateFilterOption(DATE_FILTER_VALUE.WEEK, 1),
  makeDateFilterOption(DATE_FILTER_VALUE.WEEK, 2),
  makeDateFilterOption(DATE_FILTER_VALUE.MONTH, 1),
  makeDateFilterOption(DATE_FILTER_VALUE.MONTH, 3),
  makeDateFilterOption(DATE_FILTER_VALUE.MONTH, 6),
  makeDateFilterOption(DATE_FILTER_VALUE.YEAR, 1),
  makeDateFilterOption(DATE_FILTER_VALUE.YEAR, 2),
  makeDateFilterOption(DATE_FILTER_VALUE.BEGINNING_OF_YEAR, 1),
  makeDateFilterOption(DATE_FILTER_VALUE.HOUR, 6),
  makeDateFilterOption(DATE_FILTER_VALUE.HOUR, 12),
];
