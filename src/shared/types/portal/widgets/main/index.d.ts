import type { ISharedWidgetConfig } from "shared/types/dashboard/base";

export interface INeverWidgetConfig extends ISharedWidgetConfig {
  _type: "never";
}

export type IPortalWidgetConfig = INeverWidgetConfig;
