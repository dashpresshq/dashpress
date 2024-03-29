import { noop } from "shared/lib/noop";
import { IWidgetConfig } from "shared/types/dashboard";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { ILabelValue } from "shared/types/options";
import { GranularEntityPermissions } from "shared/types/user";

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
