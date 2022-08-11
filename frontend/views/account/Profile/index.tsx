import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { useSetPageTitle } from "frontend/lib/routing";
import { useUpdateProfileMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";
import { UpdateProfileForm } from "./Form";

export function AccountProfile() {
  const authenticatedUserBag = useAuthenticatedUserBag();
  const updateProfileMutation = useUpdateProfileMutation();

  useSetPageTitle("Update Profile", ACCOUNT_VIEW_KEY);

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
