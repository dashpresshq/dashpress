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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <WidgetRoot $span="3" $height="1" key={i}>
            <BaseSkeleton height="100px" />
          </WidgetRoot>
        ))}
      </Root>
      <Root>
        <WidgetRoot $span="12" $height="3">
          <TableSkeleton />
        </WidgetRoot>
      </Root>
    </Card>
  );
}
