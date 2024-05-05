import { noop } from "shared/lib/noop";

export const portalMetaPermissionCheck = (
  key: (metaCheck: string, allPermission: string) => boolean | void
) => {
  noop(key);
  return undefined;
};
