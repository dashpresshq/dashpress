import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import { DashboardWidgetPresentation } from "./Presentation";
import { useDasboardWidgetScriptData } from "../dashboard.store";
import { IWidgetSettingProps } from "./_components/WidgetHeader/types";
import { useDashboardWidgetRelativeDateStore } from "../relativeTime.store";
import { DASHBOARD_RELATIVE_DAYS } from "./_components/WidgetHeader/constants";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const DashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting }, ref) => {
    const { widgetRelativeDate } = useDashboardWidgetRelativeDateStore();

    const data = useDasboardWidgetScriptData(
      config.id,
      widgetRelativeDate[config.id] || DASHBOARD_RELATIVE_DAYS[0].value
    );

    return (
      <DashboardWidgetPresentation
        config={config}
        setting={setting}
        ref={ref}
        data={data}
      />
    );
  }
);
