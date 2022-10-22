import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/types/user";
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
      <SectionBox title="Account Profile">
        <ViewStateMachine
          loading={authenticatedUserBag.isLoading}
          error={authenticatedUserBag.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <UpdateProfileForm
            onSubmit={updateProfileMutation.mutateAsync}
            initialValues={authenticatedUserBag.data}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseAccountLayout>
  );
}
