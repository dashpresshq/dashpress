import { ReactElement } from "react";
import { WidgetSizes } from "shared/types/dashboard";
import { z } from "zod";

export interface IWidgetConfigBag {
  size: WidgetSizes;
  height: number;
  overrideSize?: WidgetSizes;
  overrideHeight?: number;
  label: string;
  schema: z.ZodTypeAny;
  requiredInterface: string;
  exampleValidData: object;
  LoadingComponent: (prop: { height: string }) => ReactElement;
  isDataEmpty: (data: unknown) => boolean;
}
