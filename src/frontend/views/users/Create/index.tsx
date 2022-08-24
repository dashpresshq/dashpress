import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { AppLayout } from "../../../_layouts/app";
import { useCreateUserMutation } from "../users.store";
import { CreateUserForm } from "./Form";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageDetails({
    pageTitle: "Create User",
    viewKey: "CREATE_USER",
    permission: USER_PERMISSIONS.CAN_MANAGE_USER,
  });

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={TitleLang.create("User")}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
          <CreateUserForm
            onSubmit={async (user) => {
              await userCreationMutation.mutateAsync(user);
            }}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
