import { IPortalWidgetConfig } from "shared/types/portal/widgets/main";
import { noop } from "lodash";
import { forwardRef } from "react";
import { DataStateKeys } from "@hadmean/protozoa";
import { IWidgetSettingProps } from "../../_components/WidgetHeader/types";

interface IProps {
  config: IPortalWidgetConfig;
  setting?: IWidgetSettingProps;
  data: DataStateKeys<unknown>;
}

export const PortalDashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting, data }, ref) => {
    noop(config, setting, ref, data);
    return null;
  }
);
