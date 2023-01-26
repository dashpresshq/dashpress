import { IAppConfigurationBag } from "shared/configurations/types";

export type IPortalSystemSettings = {};

export const PORTAL_DEFAULT_SYSTEM_SETTINGS = {};

export type PortalConfigurationKeys = "";

export const PORTAL_CONFIGURATION_KEYS: Record<
  PortalConfigurationKeys,
  IAppConfigurationBag
> = {
  "": {
    defaultValue: "",
  },
};
