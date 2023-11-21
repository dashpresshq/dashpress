import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import {
  BaseManageVariables,
  ManageVariablesPageTitle,
} from "frontend/views/settings/Variables/Base";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ACTIONS_VIEW_KEY } from "../constants";
import { BaseActionsLayout } from "../_Base";

export function ManageVariables() {
  useSetPageDetails({
    pageTitle: ManageVariablesPageTitle,
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  });

  return (
    <BaseActionsLayout>
      <BaseManageVariables />
    </BaseActionsLayout>
  );
}
