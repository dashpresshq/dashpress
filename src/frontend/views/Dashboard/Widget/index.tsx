import { forwardRef } from "react";

import type { IWidgetConfig } from "@/shared/types/dashboard";

import { useDasboardWidgetScriptData } from "../dashboard.store";
import { useDashboardWidgetRelativeDateStore } from "../relativeTime.store";
import type { IWidgetSettingProps } from "./_components/WidgetHeader/types";
import { DashboardWidgetPresentation } from "./Presentation";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const DashboardWidget = forwardRef<HTMLDivElement, IProps>(
  function DashboardWidgetCmp({ config, setting }, ref) {
    const widgetRelativeDate = useDashboardWidgetRelativeDateStore(
      (store) => store.widgetRelativeDate
    );

    const data = useDasboardWidgetScriptData(
      config.id,
      widgetRelativeDate[config.id]
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
