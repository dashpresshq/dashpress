import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import {
  BaseManageVariables,
  MangeVariablesPageTitle,
} from "frontend/views/settings/Variables/Base";
import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ManageVariables() {
  useSetPageDetails({
    pageTitle: MangeVariablesPageTitle,
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  });

  return (
    <BaseActionsLayout>
      <BaseManageVariables />
    </BaseActionsLayout>
  );
}
