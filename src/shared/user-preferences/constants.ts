import { z } from "zod";
import { BaseUserPreferencesKeys } from "./base-types";
import { PortalUserPreferencesKeys, PORTAL_CONFIGURATION_KEYS } from "./portal";
import { IUserPreferencesBag } from "./types";

export type UserPreferencesKeys =
  | BaseUserPreferencesKeys
  | PortalUserPreferencesKeys;

export const USER_PREFERENCES_CONFIG: Record<
  UserPreferencesKeys,
  IUserPreferencesBag
> = {
  ...PORTAL_CONFIGURATION_KEYS,
  theme: {
    label: "Theme",
    defaultValue: "light",
    validation: z.enum(["light", "dark"]),
  },
};
