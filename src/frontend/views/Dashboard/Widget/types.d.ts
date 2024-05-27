import { GridSpanSizes, GridHeightSizes } from "shared/types/ui";
import { ReactElement } from "react";
import { z } from "zod";
import { MessageDescriptor } from "@lingui/core";

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
