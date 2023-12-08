import { GridHeightSizes, GridSpanSizes } from "../ui";

export interface ISharedWidgetConfig {
  id: string;
  title: string;
  script: string;
  entity?: string;
  queryId?: string;
  span?: GridSpanSizes;
  height?: GridHeightSizes;
}

export const FOR_CODE_COV = 1;
