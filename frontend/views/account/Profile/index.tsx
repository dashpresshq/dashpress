import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useSetPageTitle } from "frontend/lib/routing/useGoBackContext";
import { useMyProfile, useUpdateProfileMutation } from "../account.store";
import { BaseAccountLayout } from "../_Base";
import { UpdateProfileForm } from "./Form";

export function AccountProfile() {
  const myProfile = useMyProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  useSetPageTitle("Update Profile");

  return (
    <BaseAccountLayout>
      <ErrorAlert message={myProfile.error} />
      <SectionBox title="Account Profile">
        {myProfile.isLoading ? (
          <FormSkeleton schema={[FormSkeletonSchema.Input]} />
        ) : (
          <UpdateProfileForm
            onSubmit={updateProfileMutation.mutateAsync}
            initialValues={myProfile.data}
          />
        )}
      </SectionBox>
    </BaseAccountLayout>
  );
}
