import noop from "lodash/noop";

export const portalMetaPermissionCheck = (
  key: (metaCheck: string, allPermission: string) => boolean | void
) => {
  noop(key);
  return undefined;
};

export const PORTAL_PERMISSION_HEIRACHIES = {};
