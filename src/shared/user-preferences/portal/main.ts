import { IUserPreferencesBag } from "../types";

export type PortalUserPreferencesKeys = "";

export const PORTAL_CONFIGURATION_KEYS: Record<
  PortalUserPreferencesKeys,
  IUserPreferencesBag
> = {
  "": {
    defaultValue: "",
    label: "",
  },
};
