import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useStorageApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { AppStorage } from "frontend/lib/storage/app";
import {
  USER_PREFERENCES_CONFIG,
  UserPreferencesKeys,
  UserPreferencesValueType,
} from "shared/user-preferences/constants";

const userPrefrencesApiPath = (key: UserPreferencesKeys) => {
  return `/api/user-preferences/${key}`;
};

export function useUserPreference<T extends UserPreferencesKeys>(key: T) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PREFERENCES);
  return useStorageApi<UserPreferencesValueType<T>>(
    userPrefrencesApiPath(key),
    {
      returnUndefinedOnError: true,
      errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
      defaultData: USER_PREFERENCES_CONFIG[key].defaultValue,
      selector: (data) => data.data,
    }
  );
}

interface IUpsertConfigMutationOptions {
  otherEndpoints: string[];
}

export function useUpsertUserPreferenceMutation<T extends UserPreferencesKeys>(
  key: T,
  mutationOptions?: IUpsertConfigMutationOptions
) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PREFERENCES);
  return useWaitForResponseMutationOptions<
    UserPreferencesValueType<T>,
    UserPreferencesValueType<T>
  >({
    mutationFn: async (values) => {
      await ApiRequest.PUT(userPrefrencesApiPath(key), {
        data: values,
      });
      return values;
    },
    endpoints: [
      userPrefrencesApiPath(key),
      ...(mutationOptions?.otherEndpoints || []),
    ],
    onSuccessActionWithFormData: (data) => {
      AppStorage.set(userPrefrencesApiPath(key), data);
    },
    successMessage: domainMessages.MUTATION_LANG.SAVED,
  });
}
