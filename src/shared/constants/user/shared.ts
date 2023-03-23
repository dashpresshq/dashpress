import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { GranularEntityPermissions } from "shared/types/user";
import { makePortalPermissionString } from "../portal/user";

export const NO_PERMISSION_REQUIRED = "NO_PERMISSION_REQUIRED";

export const APPLIED_CAN_ACCESS =
  (context: string) =>
  (entity: string, granular: GranularEntityPermissions | false) => {
    if (entity === SLUG_LOADING_VALUE) {
      return NO_PERMISSION_REQUIRED;
    }
    return makePortalPermissionString(context, entity, granular);
  };
