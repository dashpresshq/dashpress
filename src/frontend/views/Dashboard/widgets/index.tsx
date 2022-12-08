import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import { IWidgetSettingProps } from "@hadmean/chromista";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { useWidgetNavigationLink } from "./useWidgetNavigationLink";
import { TableRoot, Root } from "../styles";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

export const DashboardWidget = forwardRef<HTMLInputElement, IProps>(
  ({ config, setting }, ref) => {
    const rootProps = {
      ref,
      hasSetting: !!setting,
      "data-testid": `widget__${config.id}`,
    };

    const navigationLink = useWidgetNavigationLink(
      config.entity,
      config.queryId
    );

    const sharedWidgetProps = {
      setting,
      link: navigationLink,
    };

    switch (config._type) {
      case "summary-card":
        return (
          <Root {...rootProps}>
            <SummaryWidget {...sharedWidgetProps} config={config} />
          </Root>
        );

      case "table":
        return (
          <TableRoot {...rootProps}>
            <TableWidget {...sharedWidgetProps} config={config} />
          </TableRoot>
        );
    }
  }
);
