import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import type { AppConfigurationKeys } from "shared/configurations";
import { APP_CONFIGURATION_CONFIG } from "shared/configurations";
import type { AppConfigurationValueType } from "shared/configurations/constants";

import { useIsUserAutenticated } from "../auth/auth.actions";
import { useAppConfigurationDomainMessages } from "./configuration.constant";

const GUEST_PATH = "__guest";

export const configurationApiPath = (
  key: AppConfigurationKeys,
  entity?: string,
  method: "GET" | "PUT" = "GET"
) => {
  if (entity) {
    return `/api/config/${key}/${entity}`;
  }

  if (method === "PUT") {
    return `/api/config/${key}`;
  }

  const config = APP_CONFIGURATION_CONFIG[key];

  if ("guest" in config && config.guest) {
    return `/api/config/${key}/${GUEST_PATH}`;
  }

  return `/api/config/${key}`;
};

export function useAppConfiguration<T extends AppConfigurationKeys>(key: T) {
  const domainMessages = useAppConfigurationDomainMessages(key);
  const isUserAuthenticated = useIsUserAutenticated();
  const path = configurationApiPath(key);
  return useApi<AppConfigurationValueType<T>>(configurationApiPath(key), {
    enabled: isUserAuthenticated || path.endsWith(GUEST_PATH),
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    persist: true,
    defaultData: APP_CONFIGURATION_CONFIG[key].defaultValue,
  });
}

export function useEntityConfiguration<T extends AppConfigurationKeys>(
  key: T,
  entity: string,
  forceDefaultValue?: AppConfigurationValueType<T>
) {
  const domainMessages = useAppConfigurationDomainMessages(key);

  return useApi<AppConfigurationValueType<T>>(
    configurationApiPath(key, entity),
    {
      persist: true,
      enabled:
        !!entity /* It is possible to not have the entity at the point of call */,
      errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
      defaultData:
        forceDefaultValue || (APP_CONFIGURATION_CONFIG[key].defaultValue as T),
    }
  );
}

export const useMultipleEntityConfiguration = <T extends AppConfigurationKeys>(
  entities: string[],
  key: T
) => {
  return useApiQueries<{ entity: string }, AppConfigurationValueType<T>>({
    input: entities.map((entity) => ({ entity })),
    accessor: "entity",
    pathFn: (entity) => configurationApiPath(key, entity),
    persist: true,
  });
};

interface IUpsertConfigMutationOptions {
  otherEndpoints?: string[];
}

export function useUpsertConfigurationMutation<T extends AppConfigurationKeys>(
  key: T,
  entity?: string,
  mutationOptions?: IUpsertConfigMutationOptions
) {
  const domainMessages = useAppConfigurationDomainMessages(key);

  return useWaitForResponseMutationOptions<
    AppConfigurationValueType<T>,
    AppConfigurationValueType<T>
  >({
    mutationFn: async (values) => {
      await ApiRequest.PUT(configurationApiPath(key, entity, "PUT"), {
        data: values,
      });
      return values;
    },
    endpoints: [
      configurationApiPath(key, entity),
      ...(mutationOptions?.otherEndpoints || []),
    ],
    successMessage: { description: domainMessages.MUTATION_LANG.SAVED },
  });
}
