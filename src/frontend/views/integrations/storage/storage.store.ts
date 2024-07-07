import { msg } from "@lingui/macro";

import {
  CRUD_CONFIG_NOT_FOUND,
  useDomainMessages,
} from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { ApiRequest } from "@/frontend/lib/data/makeRequest";
import { useApi } from "@/frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "@/frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { reduceStringToNumber } from "@/shared/lib/strings";
import type { IStorageIntegration } from "@/shared/types/actions";

import { usePasswordStore } from "../password.store";

export const useStorageIntegrationsList = () => {
  const domainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FILE_STORAGE
  );
  return useApi<IStorageIntegration[]>("/api/integrations/storage/list", {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
};

const ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT = "/api/integrations/storage/active";

const STORAGE_CREDENTIALS_CONFIG = `/api/integrations/storage/credentials`;

export const useActiveStorageIntegration = () =>
  useApi<{ data: string }>(ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Active Storage Integrations`),
    defaultData: { data: "" },
  });

export const useStorageCredentialsConfiguration = () => {
  const rootPassword = usePasswordStore((state) => state.password);
  return useApi<Record<string, string>>(
    `${STORAGE_CREDENTIALS_CONFIG}?${reduceStringToNumber(rootPassword)}`,
    {
      request: {
        body: {
          _password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: CRUD_CONFIG_NOT_FOUND(`Storage Credentials`),
      enabled: !!rootPassword,
      defaultData: undefined,
    }
  );
};

export function useActivateStorageMutation() {
  const domainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FILE_STORAGE
  );
  return useWaitForResponseMutationOptions<{
    storageKey: string;
    configuration: Record<string, string>;
  }>({
    mutationFn: async (configuration) =>
      await ApiRequest.POST(
        ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT,
        configuration
      ),
    endpoints: [
      ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT,
      STORAGE_CREDENTIALS_CONFIG,
    ],
    successMessage: {
      description: domainMessages.MUTATION_LANG.CUSTOM(msg`Activated`),
    },
  });
}
