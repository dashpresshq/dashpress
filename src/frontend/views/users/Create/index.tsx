import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { AppLayout } from "../../../_layouts/app";
import { ADMIN_USERS_CRUD_CONFIG, useCreateUserMutation } from "../users.store";
import { CreateUserForm } from "./Form";

const DOCS_TITLE = "System Profile";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();
  const [isDocOpen, setIsDocOpen] = useState(false);

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
          iconButtons={[
            {
              action: () => setIsDocOpen(true),
              icon: "help",
              label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
            },
          ]}
        >
          <CreateUserForm
            onSubmit={async (user) => {
              await userCreationMutation.mutateAsync(user);
            }}
          />
        </SectionBox>
      </SectionCenter>
      <SystemProfileDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </AppLayout>
  );
}
