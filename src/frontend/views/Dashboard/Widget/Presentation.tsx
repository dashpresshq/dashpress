import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import { DataStateKeys } from "@hadmean/protozoa";
import { SummaryWidget, TableWidget } from "./_render";
import { PortalDashboardWidget } from "./portal";
import { WidgetFrame } from "./_components/WidgetFrame";
import { IWidgetSettingProps } from "./_components/WidgetHeader/types";

export interface IDashboardWidgetPresentationProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
  data: DataStateKeys<unknown>;
}

export const DashboardWidgetPresentation = forwardRef<
  HTMLDivElement,
  IDashboardWidgetPresentationProps
>(({ config, setting, data }, ref) => {
  const frameProps = {
    config,
    setting,
    ref,
    type: config._type,
    data,
  };

  switch (config._type) {
    case "summary-card":
      return <WidgetFrame {...frameProps} Component={SummaryWidget} />;

    case "table":
      return <WidgetFrame {...frameProps} Component={TableWidget} />;

    default:
      return (
        <PortalDashboardWidget
          config={config}
          setting={setting}
          ref={ref}
          data={data}
        />
      );
  }
});
