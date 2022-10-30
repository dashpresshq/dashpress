import { IWidgetSettingProps } from "@hadmean/chromista";

export interface IWidgetProps<T> {
  config: T;
  setting?: IWidgetSettingProps;
  link?: string;
}
