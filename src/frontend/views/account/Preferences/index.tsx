import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useUpdateUserPreferencesMutation } from "../account.store";
import {
  ACCOUNT_PREFERENCES_CRUD_CONFIG,
  ACCOUNT_VIEW_KEY,
} from "../constants";

import { BaseAccountLayout } from "../_Base";
import { UserPreferencesForm } from "./Form";

export function UserPreferences() {
  const userPreferences = useAuthenticatedUserPreferences();
  const updateProfilePreferencesMutation = useUpdateUserPreferencesMutation();

  useSetPageDetails({
    pageTitle: ACCOUNT_PREFERENCES_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title={ACCOUNT_PREFERENCES_CRUD_CONFIG.TEXT_LANG.EDIT}>
        <ViewStateMachine
          loading={userPreferences.isLoading}
          error={userPreferences.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <UserPreferencesForm
            onSubmit={updateProfilePreferencesMutation.mutateAsync}
            initialValues={userPreferences.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseAccountLayout>
  );
}
