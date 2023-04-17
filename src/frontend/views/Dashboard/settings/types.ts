import { PortalWidgetFormField } from "./portal";

export type WidgetFormField =
  | PortalWidgetFormField
  | "entity"
  | "queryId"
  | "color"
  | "limit"
  | "icon"
  | "size"
  | "dateField"
  | "height";
