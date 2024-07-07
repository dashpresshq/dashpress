import { forwardRef } from "react";

import type { DataStateKeys } from "@/frontend/lib/data/types";
import { noop } from "@/shared/lib/noop";
import type { IPortalWidgetConfig } from "@/shared/types/portal/widgets/main";

import type { IWidgetSettingProps } from "../../_components/WidgetHeader/types";

interface IProps {
  config: IPortalWidgetConfig;
  setting?: IWidgetSettingProps;
  isPreview: boolean;
  data: DataStateKeys<unknown>;
}

export const PortalDashboardWidget = forwardRef<HTMLDivElement, IProps>(
  function PortalDashboardWidgetCmp({ config, setting, data, isPreview }, ref) {
    noop(config, setting, ref, data, isPreview);
    return null;
  }
);
