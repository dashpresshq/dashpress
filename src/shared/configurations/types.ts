export interface IAppConfigurationBag {
  requireEntity?: true;
  defaultValue: unknown;
  guest?: true;
  label: string;
}

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  update: boolean;
  delete: boolean;
}

export enum DataActionType {
  Create = "create",
  Details = "details",
  Update = "update",
  Delete = "delete",
  List = "list",
  Table = "table",
  Count = "count",
  Reference = "reference",
}
