import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { createViewStateMachine } from "frontend/lib/create-view-state-machine";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
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
  const { canGoBack, goBack } = useNavigationStack();
  const username = useUsernameFromRouteParam();
  const userDetails = useUserDetails(username);
  const authenticatedUserBag = useAuthenticatedUserBag();

  const hasResetPasswordPermission = useUserHasPermission(
    USER_PERMISSIONS.CAN_RESET_PASSWORD
  );

  useSetPageDetails({
    pageTitle: "Update User",
    viewKey: "UPDATE_USER",
    permission: USER_PERMISSIONS.CAN_MANAGE_USER,
  });

  const { isLoading } = userDetails;

  const { error } = userDetails;

  const viewStateMachine = createViewStateMachine(isLoading, error);

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit("User")}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
          {viewStateMachine.type === "loading" && (
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Textarea,
              ]}
            />
          )}

          {viewStateMachine.type === "error" && <ErrorAlert message={error} />}

          {viewStateMachine.type === "render" && (
            <UpdateUserForm
              onSubmit={updateUserMutation.mutateAsync}
              initialValues={userDetails.data}
              isMe={authenticatedUserBag.data?.username === username}
            />
          )}
        </SectionBox>
        <Spacer />
        {hasResetPasswordPermission === true &&
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
