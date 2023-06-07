import noop from "lodash/noop";
import { GranularEntityPermissions } from "shared/types/user";

export const PORTAL_USER_PERMISSIONS = {};

export const makePortalPermissionString = (
  context: string,
  entity: string,
  granular: GranularEntityPermissions | false
) => {
  noop(granular);
  return `${context}:${entity.toUpperCase()}`;
};

export const usePortalUserPermissions = () => {
  return [];
};
