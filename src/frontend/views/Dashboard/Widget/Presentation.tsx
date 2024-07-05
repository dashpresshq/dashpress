import type { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import type { DataStateKeys } from "frontend/lib/data/types";
import { SummaryWidget, TableWidget } from "./_render";
import { PortalDashboardWidget } from "./portal";
import { WidgetFrame } from "./_components/WidgetFrame";
import type { IWidgetSettingProps } from "./_components/WidgetHeader/types";

export interface IDashboardWidgetPresentationProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
  data: DataStateKeys<unknown>;
  isPreview?: true;
}

export const DashboardWidgetPresentation = forwardRef<
  HTMLDivElement,
  IDashboardWidgetPresentationProps
>(function DashboardWidgetPresentationCmp(
  { config, setting, data, isPreview },
  ref
) {
  const frameProps = {
    config,
    setting,
    ref,
    isPreview,
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
          isPreview={isPreview}
          data={data}
        />
      );
  }
});
