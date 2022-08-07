import { SectionBox, SectionCenter, Spacer } from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { AppLayout } from "../../../_layouts/app";
import {
  useUpdateUserMutation,
  useResetUserPasswordMutation,
} from "../users.store";
import { ResetUserPasswordForm } from "./ResetPassword.form";
import { UpdateUserForm } from "./Update.Form";

export function UserUpdate() {
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`Update User`, "UPDATE_USER");
  //   const myProfile = useMyProfile();

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
          {/* {myProfile.isLoading ? (
            <FormSkeleton schema={[FormSkeletonSchema.Input]} />
          ) : ( */}
          <UpdateUserForm onSubmit={updateUserMutation.mutateAsync} />
          {/* )} */}
        </SectionBox>
        <Spacer />
        <SectionBox title="Reset User Password">
          <ResetUserPasswordForm onSubmit={resetPasswordMutation.mutateAsync} />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
