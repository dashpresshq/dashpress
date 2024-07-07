import { accountApiHandlers } from "./account";
import { authApiHandlers } from "./auth";
import { configApiHandlers } from "./config";
import { dashboardApiHandlers } from "./dashboard";
import { dataApiHandlers } from "./data";
import { entitiesApiHandlers } from "./entities";
import { formActionsApiHandlers } from "./form-actions";
import { integrationsApiHandlers } from "./integrations";
import { integrationsListApiHandlers } from "./integrations-list";
import { menuApiHandlers } from "./menu";
import { portalApiHandlers } from "./portal";
import { rolesApiHandlers } from "./roles";
import { setupApiHandlers } from "./setup";
import { userPreferencesApiHandlers } from "./user-preferences";
import { versionApiHandlers } from "./versions";

export const apiHandlers = [
  ...setupApiHandlers,
  ...authApiHandlers,
  ...accountApiHandlers,
  ...entitiesApiHandlers,
  ...dataApiHandlers,
  ...integrationsApiHandlers,
  ...rolesApiHandlers,
  ...configApiHandlers,
  ...integrationsListApiHandlers,
  ...dashboardApiHandlers,
  ...versionApiHandlers,
  ...portalApiHandlers,
  ...menuApiHandlers,
  ...formActionsApiHandlers,
  ...userPreferencesApiHandlers,
];
