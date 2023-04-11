import { IPortalWidgetConfig } from "shared/types/portal/widgets/main";
import { noop } from "lodash";
import { IWidgetSettingProps } from "@hadmean/chromista";
import { forwardRef } from "react";

interface IProps {
  config: IPortalWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const PortalDashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting }, ref) => {
    noop(config, setting, ref);
    return null;
  }
);
