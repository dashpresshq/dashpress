import styled from "styled-components";
import { BaseSkeleton } from "frontend/design-system/components/Skeleton/Base";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { StyledCard } from "frontend/design-system/components/Card";
import { gridRoot, WidgetRoot } from "./styles";

const Root = styled.div`
  ${gridRoot};
`;

export function DashboardSkeleton() {
  return (
    <StyledCard>
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
        <WidgetRoot $size="4" $height="3" hasSetting={false}>
          <TableSkeleton />
        </WidgetRoot>
      </Root>
    </StyledCard>
  );
}
