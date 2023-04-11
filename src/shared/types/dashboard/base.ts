export interface ISharedWidgetConfig {
  id: string;
  title: string;
  entity: string;
  queryId: string;
  size?: "1" | "2" | "4";
  height?: number;
}
