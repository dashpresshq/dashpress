import { IWidgetConfig } from "shared/types/dashboard";
import { BaseSkeleton, Stack, TableSkeleton } from "@hadmean/chromista";
import { PORTAL_WIDGET_CONFIG } from "./portal";
import { IWidgetConfigBag } from "./types";
import { TableWidgetSchema } from "./_render/Table/types";
import { SummaryCardWidgetSchema } from "./_render/Summary/types";

const BASE_WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = {
  table: {
    height: 250,
    size: "4",
    label: "Table",
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
    height: 40,
    size: "1",
    overrideHeight: 40,
    overrideSize: "1",
    label: "Summary Card",
    exampleValidData: [{ count: 30 }],
    requiredInterface: `[{count: number}]`,
    schema: SummaryCardWidgetSchema,
    LoadingComponent: () => (
      <Stack>
        <BaseSkeleton height="40px" width="40px" circle />
        <BaseSkeleton height="40px" width="50%" />
      </Stack>
    ),
    isDataEmpty: () => {
      return false;
    },
  },
};

export const WIDGET_CONFIG: Partial<
  Record<IWidgetConfig["_type"], IWidgetConfigBag>
> = { ...PORTAL_WIDGET_CONFIG, ...BASE_WIDGET_CONFIG };
