import { useRouter } from "next/router";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";

export const useSchemaFormScriptContext = (action: string) => {
  const router = useRouter();
  const authUser = useAuthenticatedUserBag();
  return {
    routeParams: router.query,
    auth: authUser.data,
    action,
  };
};
