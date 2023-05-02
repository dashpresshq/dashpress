import { IWidgetSettingProps } from "@hadmean/chromista";

export interface IRenderWidgetProps<T> {
  config: T;
  setting?: IWidgetSettingProps;
  link?: string;
}

export const FOR_CODE_COV = 1;
