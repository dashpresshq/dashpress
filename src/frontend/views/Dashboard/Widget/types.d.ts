import type { GridSpanSizes, GridHeightSizes } from "shared/types/ui";
import type { ReactElement } from "react";
import type { z } from "zod";
import type { MessageDescriptor } from "@lingui/core";

export interface IWidgetConfigBag {
  span: GridSpanSizes;
  height: GridHeightSizes;
  label: MessageDescriptor;
  schema: z.ZodTypeAny;
  requiredInterface: string;
  exampleValidData: object;
  LoadingComponent: (prop: { height: string }) => ReactElement;
  isDataEmpty: (data: unknown) => boolean;
}
