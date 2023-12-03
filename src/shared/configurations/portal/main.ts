import { IAppConfigurationBag } from "shared/configurations/types";

export type IPortalSystemSettings = {};

export const PORTAL_DEFAULT_SYSTEM_SETTINGS = {};

export type PortalAppConfigurationKeys = "";

export const PORTAL_APP_CONFIGURATION_CONFIG: Record<
  PortalAppConfigurationKeys,
  IAppConfigurationBag
> = {
  "": {
    label: "",
    defaultValue: "",
  },
};
