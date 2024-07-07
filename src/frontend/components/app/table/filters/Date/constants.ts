import { msg } from "@lingui/macro";

import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";
import type { IDateFilterOption } from "@/shared/types/data";
import { DATE_FILTER_VALUE } from "@/shared/types/data";

const DATE_FILTER_OPTIONS$1: Record<
  DATE_FILTER_VALUE,
  Omit<IDateFilterOption, "value">
> = {
  [DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE]: {
    label: msg`Beginning of time`,
    hideOnTo: true,
  },
  [DATE_FILTER_VALUE.BEGINNING_OF_YEAR]: {
    label: msg`Beginning of Year`,
    hideOnTo: true,
  },
  [DATE_FILTER_VALUE.HOUR]: {
    label: msg`Hour`,
    countLimit: 24,
  },
  [DATE_FILTER_VALUE.DAY]: {
    label: msg`Day`,
    countLimit: 7,
  },
  [DATE_FILTER_VALUE.WEEK]: {
    label: msg`Week`,
    countLimit: 4,
  },
  [DATE_FILTER_VALUE.MONTH]: {
    label: msg`Month`,
    countLimit: 12,
  },
  [DATE_FILTER_VALUE.QUARTER]: {
    label: msg`Quarter`,
    countLimit: 4,
  },
  [DATE_FILTER_VALUE.YEAR]: {
    label: msg`Year`,
    countLimit: 10,
  },
  [DATE_FILTER_VALUE.NOW]: {
    label: msg`Now`,
    hideOnFrom: true,
  },
};

export const DATE_FILTER_OPTIONS: IDateFilterOption[] =
  typescriptSafeObjectDotEntries(DATE_FILTER_OPTIONS$1).map(
    ([value, config]) => ({ ...config, value })
  );
