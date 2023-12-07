import styled from "styled-components";
import { BaseSkeleton } from "frontend/design-system/components/Skeleton/Base";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { Card } from "frontend/design-system/components/Card";
import { dashboardGridRoot, WidgetRoot } from "./styles";

const Root = styled.div`
  ${dashboardGridRoot};
`;

export function DashboardSkeleton() {
  return (
    <Card>
      <Root style={{ padding: 10 }}>
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
        <BaseSkeleton height="100px" />
      </Root>
      <Root>
        <WidgetRoot $span="4" $height="3" hasSetting={false}>
          <TableSkeleton />
        </WidgetRoot>
      </Root>
    </Card>
  );
}
