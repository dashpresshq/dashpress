import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useSetPageTitle } from "frontend/lib/routing";
import { useMyProfile, useUpdateProfileMutation } from "../account.store";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";
import { UpdateProfileForm } from "./Form";

export function AccountProfile() {
  const myProfile = useMyProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  useSetPageTitle("Update Profile", ACCOUNT_VIEW_KEY);

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
