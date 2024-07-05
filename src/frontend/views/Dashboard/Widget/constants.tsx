import type { IWidgetConfig } from "shared/types/dashboard";
import { msg } from "@lingui/macro";
import { TableSkeleton } from "@/components/app/skeleton/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PORTAL_WIDGET_CONFIG } from "./portal";
import type { IWidgetConfigBag } from "./types";
import { TableWidgetSchema } from "./_render/Table/types";
import { SummaryCardWidgetSchema } from "./_render/Summary/types";

export const BASE_WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = {
  table: {
    height: "3",
    span: "12",
    label: msg`Table`,
    exampleValidData: [
      { age: 30, name: "John Doe", country: "Egypt" },
      { age: 24, name: "Jane Doe", country: "Brazil" },
    ],
    requiredInterface: `Array<Record<string, string | number>>`,
    schema: TableWidgetSchema,
    LoadingComponent: () => <TableSkeleton lean />,
    isDataEmpty: (data) => {
      return TableWidgetSchema.parse(data).length === 0;
    },
  },
  "summary-card": {
    height: "1",
    span: "3",
    label: msg`Summary Card`,
    exampleValidData: [{ count: 30 }],
    requiredInterface: `[{count: number} | number] | number`,
    schema: SummaryCardWidgetSchema,
    LoadingComponent: () => (
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-12" />
      </div>
    ),
    isDataEmpty: () => {
      return false;
    },
  },
};

export const WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = { ...PORTAL_WIDGET_CONFIG, ...BASE_WIDGET_CONFIG };
