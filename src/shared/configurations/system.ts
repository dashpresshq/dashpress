import {
  IPortalSystemSettings,
  PORTAL_DEFAULT_SYSTEM_SETTINGS,
} from "./portal";

export type IBaseSystemSettings = {
  forceIntrospection: boolean;
  tokenValidityDurationInDays: number;
};

export type ISystemSettings = IBaseSystemSettings & IPortalSystemSettings;

export const DEFAULT_SYSTEM_SETTINGS: ISystemSettings = {
  ...PORTAL_DEFAULT_SYSTEM_SETTINGS,
  forceIntrospection: process.env.NODE_ENV === "production",
  tokenValidityDurationInDays: 14,
};
