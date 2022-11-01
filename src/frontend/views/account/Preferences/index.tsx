import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/types/user";
import { useUpdateUserPreferencesMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";
import { UserPreferencesForm } from "./Form";

export function UserPreferences() {
  const userPreferences = useAuthenticatedUserPreferences();
  const updateProfilePreferencesMutation = useUpdateUserPreferencesMutation();

  useSetPageDetails({
    pageTitle: "Update Preferences",
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title="Update Preferences">
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
