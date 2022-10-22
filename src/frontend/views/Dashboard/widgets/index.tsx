import { IWidgetConfig } from "shared/types/dashboard";
import { forwardRef } from "react";
import styled, { css } from "styled-components";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { IWidgetSetting } from "./types";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSetting;
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
    if (config._type === "summary-card") {
      return (
        <Root {...rootProps}>
          <SummaryWidget config={config} setting={setting} />
        </Root>
      );
    }
    if (config._type === "table") {
      return (
        <TableRoot {...rootProps}>
          <TableWidget config={config} setting={setting} />
        </TableRoot>
      );
    }
    return null;
  }
);
