import { WidgetHeightUnits, WidgetSizes } from "./types";

export interface ISharedWidgetConfig {
  id: string;
  title: string;
  script: string;
  entity?: string;
  queryId?: string;
  size?: WidgetSizes;
  height?: WidgetHeightUnits;
}
