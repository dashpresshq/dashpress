import { ColorSchemes } from "shared/types/ui";
import { BaseUserPreferencesKeys } from "./base-types";
import { PortalUserPreferencesKeys, PORTAL_CONFIGURATION_KEYS } from "./portal";

export type UserPreferencesKeys =
  | BaseUserPreferencesKeys
  | PortalUserPreferencesKeys;

export const USER_PREFERENCES_CONFIG = {
  ...PORTAL_CONFIGURATION_KEYS,
  theme: {
    label: "Theme",
    defaultValue: "light" as ColorSchemes,
  },
};

export type UserPreferencesValueType<T extends UserPreferencesKeys> =
  typeof USER_PREFERENCES_CONFIG[T]["defaultValue"];
