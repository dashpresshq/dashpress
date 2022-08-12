import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { useUpdateProfileMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";
import { UpdateProfileForm } from "./Form";

export function AccountProfile() {
  const authenticatedUserBag = useAuthenticatedUserBag();
  const updateProfileMutation = useUpdateProfileMutation();

  useSetPageDetails({
    pageTitle: "Update Profile",
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <ErrorAlert message={authenticatedUserBag.error} />
      <SectionBox title="Account Profile">
        {authenticatedUserBag.isLoading ? (
          <FormSkeleton schema={[FormSkeletonSchema.Input]} />
        ) : (
          <UpdateProfileForm
            onSubmit={updateProfileMutation.mutateAsync}
            initialValues={authenticatedUserBag.data}
          />
        )}
      </SectionBox>
    </BaseAccountLayout>
  );
}
