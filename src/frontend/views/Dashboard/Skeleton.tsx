import { TableSkeleton } from "@/components/app/skeleton/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { WidgetRoot } from "./styles";

export function DashboardSkeleton() {
  return (
    <Card>
      <div className="dashboard-grid-root p-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <WidgetRoot span="3" height="1" key={i}>
            <Skeleton className="h-24" />
          </WidgetRoot>
        ))}
      </div>
      <div className="dashboard-grid-root p-2">
        <WidgetRoot span="12" height="3">
          <TableSkeleton />
        </WidgetRoot>
      </div>
    </Card>
  );
}
