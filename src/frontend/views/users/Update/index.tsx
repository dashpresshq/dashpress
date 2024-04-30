import {
  useAuthenticatedUserBag,
  useUserHasPermission,
} from "frontend/hooks/auth/user.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { UserPermissions } from "shared/constants/user";
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
import {
  IResetPasswordForm,
  RESET_PASSWORD_FORM_SCHEMA,
} from "shared/form-schemas/users/reset-password";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IUpdateUserForm } from "shared/form-schemas/users";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useUsernameFromRouteParam } from "../hooks";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useUserDetails,
} from "../users.store";

export const UPDATE_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateUserForm> =
  {
    name: {
      label: msg`Name`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    role: {
      label: msg`Role`,
      type: "selection",
      apiSelections: {
        listUrl: "/api/roles",
      },
      validations: [
        {
          validationType: "required",
        },
      ],
      formState: ($) => ({
        disabled: $.auth.username === $.routeParams.username,
      }),
    },
  };

export function UserUpdate() {
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const { backLink } = useNavigationStack();
  const username = useUsernameFromRouteParam();
  const userDetails = useUserDetails(username);
  const authenticatedUserBag = useAuthenticatedUserBag();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);

  const userHasPermission = useUserHasPermission();

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.EDIT,
    viewKey: `edit-user`,
    permission: UserPermissions.CAN_MANAGE_USERS,
  });

  const { isLoading } = userDetails;

  const { error } = userDetails;

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox title={domainMessages.TEXT_LANG.EDIT} backLink={backLink}>
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
              buttonText={domainMessages.FORM_LANG.UPDATE}
              onSubmit={updateUserMutation.mutateAsync}
              initialValues={userDetails.data}
              systemIcon="Save"
              fields={UPDATE_USER_FORM_SCHEMA}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
        {userHasPermission(UserPermissions.CAN_RESET_PASSWORD) &&
          authenticatedUserBag.data?.username !== username && (
            <SectionBox title={msg`Reset User Password`}>
              <SchemaForm<IResetPasswordForm>
                buttonText={(submitting) =>
                  submitting ? msg`Resetting Password` : msg`Reset Password`
                }
                systemIcon="Unlock"
                fields={RESET_PASSWORD_FORM_SCHEMA}
                onSubmit={resetPasswordMutation.mutateAsync}
                resetForm
              />
            </SectionBox>
          )}
      </ContentLayout.Center>
    </AppLayout>
  );
}
