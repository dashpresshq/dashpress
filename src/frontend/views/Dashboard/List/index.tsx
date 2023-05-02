import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import React from "react";

import { HOME_DASHBOARD_KEY } from "shared/types/dashboard";
import { BaseDashboard } from "./_BaseDashboard";

export function Dashboard() {
  useSetPageDetails({
    pageTitle: "Home",
    viewKey: "HOME",
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseDashboard
      dashboardId={HOME_DASHBOARD_KEY}
      showDemo
      manageLink={NAVIGATION_LINKS.DASHBOARD.MANAGE}
    />
  );
}
