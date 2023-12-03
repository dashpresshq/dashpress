import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import {
  useUpsertUserPreferenceMutation,
  useUserPreference,
} from "frontend/hooks/auth/preferences.store";
import { ColorSchemes } from "shared/types/ui";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";
import { UserPreferencesForm } from "./Form";
import { ACCOUNT_PREFERENCES_CRUD_CONFIG } from "./constants";

export function UserPreferences() {
  const userPreferences = useUserPreference<ColorSchemes>("theme");
  const upsertUserPreferenceMutation = useUpsertUserPreferenceMutation("theme");

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
            onSubmit={async (data) => {
              await upsertUserPreferenceMutation.mutateAsync(data.theme);
            }}
            initialValues={{ theme: userPreferences.data }}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseAccountLayout>
  );
}
