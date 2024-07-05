import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import type { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { CHANGE_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/profile/password";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";
import { useChangePasswordMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";

export function AccountPassword() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PASSWORD);

  const changePasswordMutation = useChangePasswordMutation();
  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.EDIT,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title={domainMessages.TEXT_LANG.EDIT}>
        <SchemaForm<IChangePasswordForm>
          onSubmit={changePasswordMutation.mutateAsync}
          systemIcon="Save"
          buttonText={domainMessages.FORM_LANG.UPDATE}
          fields={CHANGE_PASSWORD_FORM_SCHEMA}
          resetForm
        />
      </SectionBox>
    </BaseAccountLayout>
  );
}
