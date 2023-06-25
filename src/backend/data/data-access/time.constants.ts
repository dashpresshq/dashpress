import {
  subDays,
  subHours,
  subMonths,
  subQuarters,
  subYears,
  subWeeks,
} from "date-fns";
import { DATE_FILTER_VALUE } from "shared/types/data";

const RELATIVE_TIME_MAP: Partial<
  Record<DATE_FILTER_VALUE, (count: number) => Date>
> = {
  [DATE_FILTER_VALUE.HOUR]: (count) => subHours(new Date(), count),
  [DATE_FILTER_VALUE.DAY]: (count) => subDays(new Date(), count),
  [DATE_FILTER_VALUE.WEEK]: (count) => subWeeks(new Date(), count),
  [DATE_FILTER_VALUE.MONTH]: (count) => subMonths(new Date(), count),
  [DATE_FILTER_VALUE.QUARTER]: (count) => subQuarters(new Date(), count),
  [DATE_FILTER_VALUE.YEAR]: (count) => subYears(new Date(), count),
};

const CONSTANT_TIME_MAP: Partial<Record<DATE_FILTER_VALUE, () => Date>> = {
  [DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE]: () => new Date(0, 0, 0),
  [DATE_FILTER_VALUE.NOW]: () => new Date(),
  [DATE_FILTER_VALUE.BEGINNING_OF_YEAR]: () =>
    new Date(new Date().getFullYear(), 0, 0),
};

export const relativeDateNotationToActualDate = (
  relativeDateNotation: string
): Date => {
  if (!relativeDateNotation) {
    return new Date();
  }

  if (
    relativeDateNotation &&
    new Date(relativeDateNotation).toString() !== "Invalid Date"
  ) {
    return new Date(relativeDateNotation);
  }

  const constantTimeImplementation = CONSTANT_TIME_MAP[relativeDateNotation];

  if (constantTimeImplementation) {
    return constantTimeImplementation();
  }

  const [countString, field] = relativeDateNotation.split(":");
  const count = +countString;

  const relativeTimeImplementation = RELATIVE_TIME_MAP[field];

  if (relativeTimeImplementation) {
    return relativeTimeImplementation(count);
  }

  return new Date();
};
