import { IWidgetConfig } from "shared/types";
import { forwardRef } from "react";
import styled from "styled-components";
import { SummaryWidget } from "./Summary";
import { TableWidget } from "./Table";
import { IWidgetSetting } from "./types";

interface IProps {
  config: IWidgetConfig;
  setting?: IWidgetSetting;
}

const Root = styled.div`
  grid-column-start: 1;
  grid-column-end: 5;
`;

export const DashboardWidget = forwardRef<HTMLInputElement, IProps>(
  ({ config, setting }, ref) => {
    if (config._type === "summary-card") {
      return (
        <div ref={ref}>
          <SummaryWidget config={config} setting={setting} />
        </div>
      );
    }
    if (config._type === "table") {
      return (
        <Root ref={ref}>
          <TableWidget config={config} setting={setting} />
        </Root>
      );
    }
    return null;
  }
);
