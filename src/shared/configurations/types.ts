export interface IAppConfigurationBag {
  requireEntity?: true;
  defaultValue: unknown;
  guest?: true;
}

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  update: boolean;
  delete: boolean;
}
