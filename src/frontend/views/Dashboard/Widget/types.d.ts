import type { MessageDescriptor } from "@lingui/core";
import type { ReactElement } from "react";
import type { GridHeightSizes, GridSpanSizes } from "shared/types/ui";
import type { z } from "zod";

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
