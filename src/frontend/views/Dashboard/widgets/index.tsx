import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import styled, { css } from "styled-components";
import { IWidgetSettingProps } from "@hadmean/chromista";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { useWidgetNavigationLink } from "./useWidgetNavigationLink";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSettingProps;
}

const Root = styled.div<{ hasSetting: boolean }>`
  ${(props) =>
    props.hasSetting &&
    css`
      cursor: grab;
      user-select: none;
    `}
`;

const TableRoot = styled(Root)`
  grid-column-start: 1;
  grid-column-end: 5;
`;

export const DashboardWidget = forwardRef<HTMLInputElement, IProps>(
  ({ config, setting }, ref) => {
    const rootProps = {
      ref,
      hasSetting: !!setting,
    };

    const navigationLink = useWidgetNavigationLink(
      config.entity,
      config.queryId
    );

    const sharedWidgetProps = {
      setting,
      link: navigationLink,
    };

    if (config._type === "summary-card") {
      return (
        <Root {...rootProps}>
          <SummaryWidget {...sharedWidgetProps} config={config} />
        </Root>
      );
    }
    if (config._type === "table") {
      return (
        <TableRoot {...rootProps}>
          <TableWidget {...sharedWidgetProps} config={config} />
        </TableRoot>
      );
    }
    return null;
  }
);
