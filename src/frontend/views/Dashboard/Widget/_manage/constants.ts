import { WidgetSizes } from "shared/types/dashboard/types";

export const DASHBOARD_WIDGET_SIZES: { value: WidgetSizes; label: string }[] = [
  {
    label: "Full",
    value: "4",
  },
  {
    label: "Half",
    value: "2",
  },
  {
    label: "Quarter",
    value: "1",
  },
];

export const DASHBOARD_WIDGET_HEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8].map(
  (value) => ({
    label: value === 1 ? `1 Unit` : `${value} Units`,
    value: `${value}`,
  })
);
