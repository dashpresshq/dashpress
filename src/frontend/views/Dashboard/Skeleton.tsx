import { BaseSkeleton, TableSkeleton, StyledCard } from "@hadmean/chromista";
import styled from "styled-components";
import { gridRoot, TableRoot } from "./styles";

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
        <TableRoot hasSetting={false}>
          <TableSkeleton />
        </TableRoot>
      </Root>
    </StyledCard>
  );
}
