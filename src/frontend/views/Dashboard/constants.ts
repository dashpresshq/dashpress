import { msg } from "@lingui/macro";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";

export const DASHBOARD_WIDGETS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Dashboard Widgets`,
  singular: msg`Dashboard Widget`,
});

export const DASHBOARD_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Dashboards`,
  singular: msg`Dashboard`,
});
