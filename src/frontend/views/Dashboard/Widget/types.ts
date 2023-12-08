import { GridSpanSizes, GridHeightSizes } from "shared/types/ui";
import { ReactElement } from "react";
import { z } from "zod";

export interface IWidgetConfigBag {
  span: GridSpanSizes;
  height: GridHeightSizes;
  label: string;
  schema: z.ZodTypeAny;
  requiredInterface: string;
  exampleValidData: object;
  LoadingComponent: (prop: { height: string }) => ReactElement;
  isDataEmpty: (data: unknown) => boolean;
}

export const FOR_CODE_COV = 1;
