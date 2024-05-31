import { IWidgetConfig } from "shared/types/dashboard";
import { Stack } from "frontend/design-system/primitives/Stack";
import { BaseSkeleton } from "frontend/design-system/components/Skeleton/Base";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { msg } from "@lingui/macro";
import { PORTAL_WIDGET_CONFIG } from "./portal";
import { IWidgetConfigBag } from "./types";
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
      <Stack $justify="space-between">
        <Stack $align="center">
          <BaseSkeleton height="40px" width="40px" circle />
          <BaseSkeleton height="30px" width="100px" />
        </Stack>
        <BaseSkeleton height="30px" width="50px" />
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
