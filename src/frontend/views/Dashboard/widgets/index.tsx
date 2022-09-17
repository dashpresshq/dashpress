import { IWidgetConfig } from "shared/types";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { IWidgetSetting } from "./types";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSetting;
}

export function DashboardWidget({ config, setting }: IProps) {
  if (config._type === "summary-card") {
    return <SummaryWidget config={config} setting={setting} />;
  }
  if (config._type === "table") {
    return <TableWidget config={config} setting={setting} />;
  }
  return null;
}
