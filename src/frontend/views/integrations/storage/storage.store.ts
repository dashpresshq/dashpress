import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { IIntegrationsList } from "shared/types/actions";
import { usePasswordStore } from "../password.store";

export const useStorageIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/integrations/storage/list", {
    errorMessage: dataNotFoundMessage("Storage Integrations"),
  });

const ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT = "/api/integrations/storage/active";

const ACTIVATION_CONFIG = (storageKey: string) => {
  return `/api/integrations/storage/${storageKey}/credentials`;
};

export const useActiveStorageIntegrationList = () =>
  useApi<string[]>(ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Active Storage"),
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
      errorMessage: dataNotFoundMessage("Storage Credentials"),
      enabled: !!storageKey && !!rootPassword,
    }
  );
};

export function useDeactivateStorageMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT],
    successMessage: "Storage Integration Deactivated Successfully",
  });

  return useMutation(
    async (storageKey: string) =>
      await makeDeleteRequest(`/api/integrations/storage/${storageKey}`),
    apiMutateOptions
  );
}

export function useActivateStorageMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_STORAGE_INTEGRATIONS_ENDPOINT],
    successMessage: "Storage Integration Activated Successfully",
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePostRequest(
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
    successMessage: MutationsLang.saved("Storage Integration"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePatchRequest(
        `/api/integrations/storage/${storageKey}`,
        configuration
      ),
    apiMutateOptions
  );
}
