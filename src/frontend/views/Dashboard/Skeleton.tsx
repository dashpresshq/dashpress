import { BaseSkeleton, TableSkeleton, StyledCard } from "@hadmean/chromista";
import styled from "styled-components";
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
        <WidgetRoot size="4" hasSetting={false}>
          <TableSkeleton />
        </WidgetRoot>
      </Root>
    </StyledCard>
  );
}
