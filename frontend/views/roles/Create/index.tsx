import { SectionBox, SectionCenter } from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { AppLayout } from "../../../_layouts/app";
import { useCreateRoleMutation } from "../roles.store";
import { CreateRoleForm } from "./Form";

export function RoleCreate() {
  const roleCreationMutation = useCreateRoleMutation();
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`Create Role`, "CREATE_ROLE");

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={TitleLang.create("Role")}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
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
