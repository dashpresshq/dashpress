import { IValueLabel } from "@hadmean/chromista/dist/types";
import { DATE_FILTER_VALUE } from "shared/types/data";

const DATE_FILTER_VALUE_CONFIG: Record<
  DATE_FILTER_VALUE,
  { singular: string; plural: string }
> = {
  [DATE_FILTER_VALUE.HOUR]: {
    singular: "Hour",
    plural: "Hours",
  },
  [DATE_FILTER_VALUE.DAY]: {
    singular: "Day",
    plural: "Days",
  },
  [DATE_FILTER_VALUE.WEEK]: {
    singular: "Week",
    plural: "Weeks",
  },
  [DATE_FILTER_VALUE.MONTH]: {
    singular: "Month",
    plural: "Months",
  },
  [DATE_FILTER_VALUE.QUARTER]: {
    singular: "Quarter",
    plural: "Quarters",
  },
  [DATE_FILTER_VALUE.YEAR]: {
    singular: "Year",
    plural: "Years",
  },
  [DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE]: {
    singular: "Genesis",
    plural: "Genesis",
  },
  [DATE_FILTER_VALUE.BEGINNING_OF_YEAR]: {
    singular: "Start of year",
    plural: "Start of year",
  },
  [DATE_FILTER_VALUE.NOW]: {
    singular: "Now",
    plural: "Now",
  },
};

const makeDateFilterOption = (
  filterValue: DATE_FILTER_VALUE,
  value: number
): IValueLabel => {
  if (filterValue === DATE_FILTER_VALUE.BEGINNING_OF_YEAR) {
    return { value: filterValue, label: "Start of year" };
  }

  return {
    label: `${value} ${
      value === 1
        ? DATE_FILTER_VALUE_CONFIG[filterValue].singular
        : DATE_FILTER_VALUE_CONFIG[filterValue].plural
    }`,
    value: `${value}:${filterValue}`,
  };
};

export const DASHBOARD_RELATIVE_DAYS: IValueLabel[] = [
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
