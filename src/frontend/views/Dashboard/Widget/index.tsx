import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import { DashboardWidgetPresentation } from "./Presentation";
import { useDasboardWidgetScriptData } from "../dashboard.store";
import { IWidgetSettingProps } from "./_components/WidgetHeader/types";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const DashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting }, ref) => {
    const data = useDasboardWidgetScriptData(config.id);

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
