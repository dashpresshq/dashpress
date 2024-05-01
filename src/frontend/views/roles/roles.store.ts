import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import {
  MAKE_ENDPOINTS_CONFIG,
  useDomainMessages,
} from "frontend/lib/crud-config";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";

export const ROLES_ENDPOINT_CONFIG = MAKE_ENDPOINTS_CONFIG("/api/roles");

export function useCreateRoleMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.ROLES);
  const router = useRouter();
  return useWaitForResponseMutationOptions<IBaseRoleForm, IBaseRoleForm>({
    mutationFn: async (data) => {
      await ApiRequest.POST(ROLES_ENDPOINT_CONFIG.CREATE, data);
      return data;
    },
    endpoints: [ROLES_ENDPOINT_CONFIG.LIST],
    smartSuccessMessage: ({ name }) => ({
      message: domainMessages.MUTATION_LANG.CREATE,
      action: {
        label: domainMessages.MUTATION_LANG.VIEW_DETAILS,
        action: () =>
          router.push(NAVIGATION_LINKS.ROLES.DETAILS(makeRoleId(name))),
      },
    }),
  });
}

export function useRoleDeletionMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.ROLES);
  const router = useRouter();
  return useApiMutateOptimisticOptions<IRolesList[], string>({
    mutationFn: async (roleId) =>
      await ApiRequest.DELETE(ROLES_ENDPOINT_CONFIG.DELETE(roleId)),
    dataQueryPath: ROLES_ENDPOINT_CONFIG.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.ROLES.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("value"),
    successMessage: domainMessages.MUTATION_LANG.DELETE,
  });
}
