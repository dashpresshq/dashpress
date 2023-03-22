import noop from "lodash/noop";
import { IWidgetConfig } from "shared/types/dashboard";
import { META_USER_PERMISSIONS } from "shared/constants/user";

export const mutateGeneratedDashboardWidgets = async (
  wigdets: IWidgetConfig[]
): Promise<IWidgetConfig[]> => {
  return wigdets;
};

export const PORTAL_DASHBOARD_PERMISSION = (key: string) => {
  noop(key);
  return META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED;
};
