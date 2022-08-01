import { SectionBox } from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useChangePasswordMutation } from "../account.store";

import { BaseAccountLayout } from "../_Base";
import { ChangePasswordForm } from "./Form";

export function AccountPassword() {
  const changePasswordMutation = useChangePasswordMutation();

  return (
    <BaseAccountLayout
      menuItem={{
        link: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
        name: "Change Password",
      }}
    >
      <SectionBox title="Change Password">
        <ChangePasswordForm onSubmit={changePasswordMutation.mutateAsync} />
      </SectionBox>
    </BaseAccountLayout>
  );
}
