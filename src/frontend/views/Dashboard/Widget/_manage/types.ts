import { PortalWidgetFormField } from "./portal";

export type WidgetFormField =
  | PortalWidgetFormField
  | "entity"
  | "queryId"
  | "color"
  | "icon"
  | "size"
  | "height";
