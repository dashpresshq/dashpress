import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@gothicgeeks/design-system";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useMyProfile, useUpdateProfileMutation } from "../account.store";
import { BaseAccountLayout } from "../_Base";
import { UpdateProfileForm } from "./Form";

export function AccountProfile() {
  const myProfile = useMyProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  return (
    <BaseAccountLayout
      menuItem={{
        link: NAVIGATION_LINKS.ACCOUNT.PROFILE,
        name: "Update Profile",
      }}
    >
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
