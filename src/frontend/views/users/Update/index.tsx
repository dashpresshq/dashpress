import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { USER_PERMISSIONS } from "shared/types/user";
import { AppLayout } from "../../../_layouts/app";
import { useUsernameFromRouteParam } from "../hooks";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useUserDetails,
} from "../users.store";
import { ResetUserPasswordForm } from "./ResetPassword.form";
import { UpdateUserForm } from "./Update.Form";

export function UserUpdate() {
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const { backLink } = useNavigationStack();
  const username = useUsernameFromRouteParam();
  const userDetails = useUserDetails(username);
  const authenticatedUserBag = useAuthenticatedUserBag();

  const userHasPermission = useUserHasPermission();

  useSetPageDetails({
    pageTitle: "Update User",
    viewKey: "UPDATE_USER",
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  const { isLoading } = userDetails;

  const { error } = userDetails;

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit("User Profile")}
          iconButtons={[
            {
              action: LINK_TO_DOCS("accounts/system-profile"),
              icon: "help",
              label: "System Profile Documentation",
            },
          ]}
          backLink={backLink}
        >
          <ViewStateMachine
            loading={isLoading}
            error={error}
            loader={
              <FormSkeleton
                schema={[
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Input,
                  FormSkeletonSchema.Textarea,
                ]}
              />
            }
          >
            <UpdateUserForm
              onSubmit={updateUserMutation.mutateAsync}
              initialValues={userDetails.data}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
        {userHasPermission(USER_PERMISSIONS.CAN_RESET_PASSWORD) &&
          authenticatedUserBag.data?.username !== username && (
            <SectionBox title="Reset User Password">
              <ResetUserPasswordForm
                onSubmit={resetPasswordMutation.mutateAsync}
              />
            </SectionBox>
          )}
      </SectionCenter>
    </AppLayout>
  );
}
