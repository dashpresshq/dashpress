import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@hadmean/chromista";
import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { AppLayout } from "../../../_layouts/app";
import { useUsernameFromRouteParam } from "../hooks";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useUserDetails,
  ADMIN_USERS_CRUD_CONFIG,
} from "../users.store";
import { ResetUserPasswordForm } from "./ResetPassword.form";
import { UpdateUserForm } from "./Update.Form";

const DOCS_TITLE = "System Profile";

export function UserUpdate() {
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const { backLink } = useNavigationStack();
  const username = useUsernameFromRouteParam();
  const userDetails = useUserDetails(username);
  const authenticatedUserBag = useAuthenticatedUserBag();

  const userHasPermission = useUserHasPermission();
  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  const { isLoading } = userDetails;

  const { error } = userDetails;

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT}
          iconButtons={[
            {
              action: () => setIsDocOpen(true),
              icon: "help",
              label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
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
      <SystemProfileDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </AppLayout>
  );
}
