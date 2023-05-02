import { WidgetSizes } from "shared/types/dashboard";

export const DASHBOARD_WIDGET_SIZES: { value: WidgetSizes; label: string }[] = [
  {
    label: "Large",
    value: "4",
  },
  {
    label: "Medium",
    value: "2",
  },
  {
    label: "Small",
    value: "1",
  },
];

export const DASHBOARD_WIDGET_HEIGHTS = [150, 250, 350, 450].map((value) => ({
  value: `${value}`,
  label: `${value}`,
}));
