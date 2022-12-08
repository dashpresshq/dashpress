import { BaseSkeleton, TableSkeleton } from "@hadmean/chromista";
import styled from "styled-components";
import { gridRoot, TableRoot } from "./styles";

const Root = styled.div`
  ${gridRoot};
`;

export function DashboardSkeleton() {
  return (
    <Root>
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <BaseSkeleton height="100px" />
      <TableRoot hasSetting={false}>
        <TableSkeleton />
      </TableRoot>
    </Root>
  );
}
