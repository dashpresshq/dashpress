import { META_USER_PERMISSIONS } from "shared/constants/user";
import { noop } from "shared/lib/noop";
import type { IWidgetConfig } from "shared/types/dashboard";
import type { ILabelValue } from "shared/types/options";
import type { GranularEntityPermissions } from "shared/types/user";

export const mutateGeneratedDashboardWidgets = async (
  wigdets: IWidgetConfig[],
  _entities: ILabelValue[]
): Promise<IWidgetConfig[]> => {
  noop(_entities);
  return wigdets;
};

export const PORTAL_DASHBOARD_PERMISSION = (
  key: string,
  granular: GranularEntityPermissions
) => {
  noop(key, granular);
  return META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED;
};
