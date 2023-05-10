import { WidgetSizes } from "shared/types/dashboard";

export const DASHBOARD_WIDGET_SIZES: { value: WidgetSizes; label: string }[] = [
  {
    label: "Quarter",
    value: "4",
  },
  {
    label: "Half",
    value: "2",
  },
  {
    label: "Full",
    value: "1",
  },
];

export const DASHBOARD_WIDGET_HEIGHTS = [
  {
    value: "150",
    label: "Small",
  },
  {
    value: "250",
    label: "Medium",
  },
  {
    value: "350",
    label: "Large",
  },
  {
    value: "450",
    label: "Xtra Large",
  },
];
