import { ReactElement } from "react";
import { WidgetHeightUnits, WidgetSizes } from "shared/types/dashboard/types";
import { z } from "zod";

export interface IWidgetConfigBag {
  size: WidgetSizes;
  height: WidgetHeightUnits;
  label: string;
  schema: z.ZodTypeAny;
  requiredInterface: string;
  exampleValidData: object;
  LoadingComponent: (prop: { height: string }) => ReactElement;
  isDataEmpty: (data: unknown) => boolean;
}

export const FOR_CODE_COV = 1;
