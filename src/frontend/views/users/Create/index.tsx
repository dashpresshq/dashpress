import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { AppLayout } from "../../../_layouts/app";
import { ADMIN_USERS_CRUD_CONFIG, useCreateUserMutation } from "../users.store";
import { CreateUserForm } from "./Form";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
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
