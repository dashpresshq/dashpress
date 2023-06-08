import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { GranularEntityPermissions } from "shared/types/user";

export const NO_PERMISSION_REQUIRED = "NO_PERMISSION_REQUIRED";

export const APPLIED_CAN_ACCESS =
  (context: string) =>
  (entity: string, granular: GranularEntityPermissions) => {
    if (entity === SLUG_LOADING_VALUE) {
      return NO_PERMISSION_REQUIRED;
    }
    return `${context}:${entity.toUpperCase()}--${granular}`;
  };

export const replaceGranular = (
  permissionString: string,
  granular: GranularEntityPermissions
) => {
  const [firstPart] = permissionString.split("--");

  return `${firstPart}--${granular}`;
};
