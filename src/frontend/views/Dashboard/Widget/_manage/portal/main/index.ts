import type { IWidgetConfig } from "shared/types/dashboard";
import type { WidgetFormField } from "../../types";

export type PortalWidgetFormField = "";

export const PortalFormSchema: Partial<
  Record<IWidgetConfig["_type"], WidgetFormField[]>
> = {};
