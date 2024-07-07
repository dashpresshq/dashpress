import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import {
  BaseManageVariables,
  ManageVariablesPageTitle,
} from "@/frontend/views/settings/Variables/Base";
import { UserPermissions } from "@/shared/constants/user";

import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ManageVariables() {
  useSetPageDetails({
    pageTitle: ManageVariablesPageTitle,
    viewKey: ACTIONS_VIEW_KEY,
    permission: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
  });

  return (
    <BaseActionsLayout>
      <BaseManageVariables />
    </BaseActionsLayout>
  );
}
