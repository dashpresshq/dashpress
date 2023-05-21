export interface ISharedWidgetConfig {
  id: string;
  title: string;
  script: string;
  entity?: string;
  queryId?: string;
  size?: "1" | "2" | "4";
  height?: number;
}

export const FOR_CODE_COV = 1;
