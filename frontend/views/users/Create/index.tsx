import { SectionBox, SectionCenter } from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { AppLayout } from "../../../_layouts/app";
import { useCreateUserMutation } from "../users.store";
import { CreateUserForm } from "./Form";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`Create User`, "CREATE_USER");

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
