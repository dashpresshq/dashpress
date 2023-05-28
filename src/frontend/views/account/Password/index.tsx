import { SectionBox } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useChangePasswordMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY, PASSWORD_CRUD_CONFIG } from "../constants";

import { BaseAccountLayout } from "../_Base";
import { ChangePasswordForm } from "./Form";

export function AccountPassword() {
  const changePasswordMutation = useChangePasswordMutation();
  useSetPageDetails({
    pageTitle: PASSWORD_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title={PASSWORD_CRUD_CONFIG.TEXT_LANG.EDIT}>
        <ChangePasswordForm onSubmit={changePasswordMutation.mutateAsync} />
      </SectionBox>
    </BaseAccountLayout>
  );
}
