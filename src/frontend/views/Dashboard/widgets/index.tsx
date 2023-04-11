import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import { IWidgetSettingProps } from "@hadmean/chromista";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { WidgetRoot } from "../styles";
import { PortalDashboardWidget } from "./portal";
import { WidgetFrame } from "./_components/WidgetFrame";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const DashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting }, ref) => {
    switch (config._type) {
      case "summary-card":
        return (
          <WidgetRoot
            size="1"
            {...{
              ref,
              hasSetting: !!setting,
              "aria-label": `${config.title} Widget`,
            }}
          >
            <SummaryWidget setting={setting} config={config} />
          </WidgetRoot>
        );

      case "table":
        return (
          <WidgetFrame
            config={config}
            ref={ref}
            type={config._type}
            setting={setting}
          >
            <TableWidget config={config} />
          </WidgetFrame>
        );

      default:
        return (
          <PortalDashboardWidget config={config} setting={setting} ref={ref} />
        );
    }
  }
);
