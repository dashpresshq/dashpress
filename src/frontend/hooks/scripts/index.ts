import { useRouter } from "next/router";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import type { IEvaluateScriptContext } from "shared/types/forms";

export const useEvaluateScriptContext = (): IEvaluateScriptContext => {
  const router = useRouter();
  const authUser = useAuthenticatedUserBag();
  return {
    routeParams: router.query as Record<string, string>,
    auth: authUser.data,
  };
};
