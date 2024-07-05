import type { IPortalSystemSettings } from "./portal";
import { PORTAL_DEFAULT_SYSTEM_SETTINGS } from "./portal";

export type IBaseSystemSettings = {
  tokenValidityDurationInDays: number;
};

export type ISystemSettings = IBaseSystemSettings & IPortalSystemSettings;

export const DEFAULT_SYSTEM_SETTINGS: ISystemSettings = {
  ...PORTAL_DEFAULT_SYSTEM_SETTINGS,
  tokenValidityDurationInDays: 14,
};
