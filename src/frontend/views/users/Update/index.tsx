import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { USER_PERMISSIONS } from "shared/constants/user";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import { UPDATE_USER_FORM_SCHEMA } from "shared/form-schemas/users/update";
import {
  IResetPasswordForm,
  RESET_PASSWORD_FORM_SCHEMA,
} from "shared/form-schemas/users/reset-password";
import { IUpdateUserForm } from "shared/form-schemas/profile/update";
import { useUsernameFromRouteParam } from "../hooks";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useUserDetails,
  ADMIN_USERS_CRUD_CONFIG,
} from "../users.store";

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
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT}
          actionButtons={[
            {
              _type: "normal",
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
            <SchemaForm<IUpdateUserForm>
              buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.UPDATE}
              onSubmit={updateUserMutation.mutateAsync}
              initialValues={userDetails.data}
              icon="save"
              fields={UPDATE_USER_FORM_SCHEMA}
              formExtension={{
                fieldsState: `return {
          role: {
              disabled: $.auth.username === $.routeParams.username 
          }
        }`,
              }}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
        {userHasPermission(USER_PERMISSIONS.CAN_RESET_PASSWORD) &&
          authenticatedUserBag.data?.username !== username && (
            <SectionBox title="Reset User Password">
              <SchemaForm<IResetPasswordForm>
                buttonText={(submitting) =>
                  submitting ? "Resetting Password" : "Reset Password"
                }
                icon="no-icon"
                fields={RESET_PASSWORD_FORM_SCHEMA}
                onSubmit={resetPasswordMutation.mutateAsync}
                resetForm
              />
            </SectionBox>
          )}
      </ContentLayout.Center>
      <SystemProfileDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </AppLayout>
  );
}
