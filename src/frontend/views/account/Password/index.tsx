import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  CHANGE_PASSWORD_FORM_SCHEMA,
  IChangePasswordForm,
} from "shared/form-schemas/profile/password";
import { useChangePasswordMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY, PASSWORD_CRUD_CONFIG } from "../constants";

import { BaseAccountLayout } from "../_Base";

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
        <SchemaForm<IChangePasswordForm>
          onSubmit={changePasswordMutation.mutateAsync}
          systemIcon="Save"
          buttonText={PASSWORD_CRUD_CONFIG.FORM_LANG.UPDATE}
          fields={CHANGE_PASSWORD_FORM_SCHEMA}
          resetForm
        />
      </SectionBox>
    </BaseAccountLayout>
  );
}
