import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  IUpdateProfileForm,
  UPDATE_PROFILE_FORM_SCHEMA,
} from "shared/form-schemas/profile/update";
import { SchemaForm } from "frontend/components/SchemaForm";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useDomainMessages } from "frontend/lib/crud-config";
import { useUpdateProfileMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";

export function AccountProfile() {
  const authenticatedUserBag = useAuthenticatedUserBag();
  const updateProfileMutation = useUpdateProfileMutation();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PROFILE);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.EDIT,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title={domainMessages.TEXT_LANG.EDIT}>
        <ViewStateMachine
          loading={authenticatedUserBag.isLoading}
          error={authenticatedUserBag.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<IUpdateProfileForm>
            onSubmit={updateProfileMutation.mutateAsync}
            initialValues={authenticatedUserBag.data}
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={UPDATE_PROFILE_FORM_SCHEMA}
            systemIcon="Save"
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseAccountLayout>
  );
}
