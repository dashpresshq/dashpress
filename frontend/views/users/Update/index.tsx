import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { useMyProfile } from "frontend/views/account/account.store";
import { useViewStateMachine } from "frontend/views/entity/useViewStateMachine";
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
  const myProfile = useMyProfile();

  useSetPageTitle(`Update User`, "UPDATE_USER");

  const { isLoading } = userDetails;

  const { error } = userDetails;

  const viewStateMachine = useViewStateMachine(isLoading, error);

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
              isMe={myProfile.data?.username === username}
            />
          )}
        </SectionBox>
        <Spacer />
        {myProfile.data?.username !== username && (
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
