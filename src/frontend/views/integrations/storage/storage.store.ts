import { useMutation } from "react-query";
import { IIntegrationsList } from "shared/types/actions";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { reduceStringToNumber } from "shared/lib/strings";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { usePasswordStore } from "../password.store";
import { STORAGE_INTEGRATIONS_CRUD_CONFIG } from "./constants";

export const useStorageIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/integrations/storage/list", {
    errorMessage: STORAGE_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });

const ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT = "/api/integrations/storage/active";

const ACTIVATION_CONFIG = (storageKey: string) => {
  return `/api/integrations/storage/${storageKey}/credentials`;
};

export const useActiveStorageIntegrationList = () =>
  useApi<string[]>(ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Active Storage Integrations"),
    defaultData: [],
  });

export const useStorageIntegrationConfiguration = (storageKey: string) => {
  const rootPassword = usePasswordStore((state) => state.password);
  return useApi<Record<string, string>>(
    `${ACTIVATION_CONFIG(storageKey)}?${reduceStringToNumber(rootPassword)}`,
    {
      request: {
        body: {
          password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: CRUD_CONFIG_NOT_FOUND("Storage Credentials"),
      enabled: !!storageKey && !!rootPassword,
      defaultData: {},
    }
  );
};

export function useDeactivateStorageMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT],
    successMessage: STORAGE_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.DE_ACTIVATED,
  });

  return useMutation(
    async (storageKey: string) =>
      await makeActionRequest(
        "DELETE",
        `/api/integrations/storage/${storageKey}`
      ),
    apiMutateOptions
  );
}

export function useActivateStorageMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT],
    successMessage: STORAGE_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.ACTIVATED,
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makeActionRequest(
        "POST",
        `/api/integrations/storage/${integrationKey}`,
        configuration
      ),
    apiMutateOptions
  );
}

export function useUpdateActivatedStorageMutation(storageKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT],
    successMessage: STORAGE_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makeActionRequest(
        "PATCH",
        `/api/integrations/storage/${storageKey}`,
        configuration
      ),
    apiMutateOptions
  );
}
