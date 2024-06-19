import styled from "styled-components";
import { TableSkeleton } from "@/components/app/skeleton/table";
import { dashboardGridRoot, WidgetRoot } from "./styles";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Root = styled.div`
  ${dashboardGridRoot};
`;

export function DashboardSkeleton() {
  return (
    <Card>
      <Root className="p-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <WidgetRoot $span="3" $height="1" key={i}>
            <Skeleton className="h-24" />
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
