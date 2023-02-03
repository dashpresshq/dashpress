import {
  subDays,
  subHours,
  subMonths,
  subQuarters,
  subYears,
  subWeeks,
} from "date-fns";
import { DATE_FILTER_VALUE } from "@hadmean/protozoa";

export const RELATIVE_TIME_MAP: Partial<
  Record<DATE_FILTER_VALUE, (count: number) => Date>
> = {
  [DATE_FILTER_VALUE.HOUR]: (count) => subHours(new Date(), count),
  [DATE_FILTER_VALUE.DAY]: (count) => subDays(new Date(), count),
  [DATE_FILTER_VALUE.WEEK]: (count) => subWeeks(new Date(), count),
  [DATE_FILTER_VALUE.MONTH]: (count) => subMonths(new Date(), count),
  [DATE_FILTER_VALUE.QUARTER]: (count) => subQuarters(new Date(), count),
  [DATE_FILTER_VALUE.YEAR]: (count) => subYears(new Date(), count),
};

export const CONSTANT_TIME_MAP: Partial<Record<DATE_FILTER_VALUE, () => Date>> =
  {
    [DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE]: () => new Date(0, 0, 0),
    [DATE_FILTER_VALUE.NOW]: () => new Date(),
    [DATE_FILTER_VALUE.BEGINNING_OF_YEAR]: () =>
      new Date(new Date().getFullYear(), 0, 0),
  };
