import { IPortalWidgetConfig } from "shared/types/portal/widgets/main";
import { noop } from "lodash";
import { forwardRef } from "react";
import { DataStateKeys } from "@hadmean/protozoa";
import { IWidgetSettingProps } from "../../_components/WidgetHeader/types";

interface IProps {
  config: IPortalWidgetConfig;
  setting?: IWidgetSettingProps;
  isPreview: boolean;
  data: DataStateKeys<unknown>;
}

export const PortalDashboardWidget = forwardRef<HTMLDivElement, IProps>(
  ({ config, setting, data, isPreview }, ref) => {
    noop(config, setting, ref, data, isPreview);
    return null;
  }
);
