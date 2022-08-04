import { SectionBox } from "@gothicgeeks/design-system";
import { useSetPageTitle } from "frontend/lib/routing";
import { useChangePasswordMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";
import { ChangePasswordForm } from "./Form";

export function AccountPassword() {
  const changePasswordMutation = useChangePasswordMutation();
  useSetPageTitle("Change Password", ACCOUNT_VIEW_KEY);

  return (
    <BaseAccountLayout>
      <SectionBox title="Change Password">
        <ChangePasswordForm onSubmit={changePasswordMutation.mutateAsync} />
      </SectionBox>
    </BaseAccountLayout>
  );
}
