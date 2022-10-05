import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { AppLayout } from "../../../_layouts/app";
import { useCreateRoleMutation } from "../roles.store";
import { CreateRoleForm } from "./Form";

export function RoleCreate() {
  const roleCreationMutation = useCreateRoleMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: "Create Role",
    viewKey: "CREATE_ROLE",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox title={TitleLang.create("Role")} backLink={backLink}>
          <CreateRoleForm
            onSubmit={async (role) => {
              await roleCreationMutation.mutateAsync(role);
            }}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
