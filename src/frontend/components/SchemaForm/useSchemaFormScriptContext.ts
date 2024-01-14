import { useRouter } from "next/router";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { ISchemaFormScriptContext } from "shared/form-schemas/types";

export const useSchemaFormScriptContext = (
  action: string
): ISchemaFormScriptContext => {
  const router = useRouter();
  const authUser = useAuthenticatedUserBag();
  return {
    routeParams: router.query as Record<string, string>,
    auth: authUser.data,
    action,
  };
};
