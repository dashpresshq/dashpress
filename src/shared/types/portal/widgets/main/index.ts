import { ISharedWidgetConfig } from "shared/types/dashboard/base";

export interface INeverWidgetConfig extends ISharedWidgetConfig {
  _type: "never";
}

export type IPortalWidgetConfig = INeverWidgetConfig;

export const FOR_CODE_COV = 1;
