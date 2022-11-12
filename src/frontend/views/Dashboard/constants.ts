import { DATE_FILTER_VALUE } from "@hadmean/protozoa";
import { IValueLabel } from "@hadmean/chromista/dist/types";

export const DASHBOARD_RELATIVE_DAYS: IValueLabel[] = [
  {
    label: "1 Week",
    value: `1:${DATE_FILTER_VALUE.WEEK}`,
  },
  {
    label: "2 Weeks",
    value: `2:${DATE_FILTER_VALUE.WEEK}`,
  },
  {
    label: "1 Month",
    value: `1:${DATE_FILTER_VALUE.MONTH}`,
  },
  {
    label: "3 Months",
    value: `3:${DATE_FILTER_VALUE.MONTH}`,
  },
  {
    label: "6 Months",
    value: `6:${DATE_FILTER_VALUE.MONTH}`,
  },
  {
    label: "1 Year",
    value: `1:${DATE_FILTER_VALUE.YEAR}`,
  },
  {
    label: "1 Day",
    value: `1:${DATE_FILTER_VALUE.DAY}`,
  },
  {
    label: "3 Days",
    value: `3:${DATE_FILTER_VALUE.DAY}`,
  },
];
