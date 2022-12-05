import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { AppLayout } from "../../../_layouts/app";
import { useCreateUserMutation } from "../users.store";
import { CreateUserForm } from "./Form";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: "Create User",
    viewKey: "CREATE_USER",
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox title={TitleLang.create("User")} backLink={backLink}>
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
