import { SectionBox } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types/user";
import { useChangePasswordMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";
import { ChangePasswordForm } from "./Form";

export function AccountPassword() {
  const changePasswordMutation = useChangePasswordMutation();
  useSetPageDetails({
    pageTitle: "Change Password",
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title="Change Password">
        <ChangePasswordForm onSubmit={changePasswordMutation.mutateAsync} />
      </SectionBox>
    </BaseAccountLayout>
  );
}
