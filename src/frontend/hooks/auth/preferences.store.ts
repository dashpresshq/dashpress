import { useMutation } from "react-query";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useStorageApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { AppStorage } from "frontend/lib/storage/app";
import {
  USER_PREFERENCES_CONFIG,
  UserPreferencesKeys,
} from "shared/user-preferences/constants";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useIsAuthenticatedStore } from "./useAuthenticateUser";

const userPrefrencesApiPath = (key: UserPreferencesKeys) => {
  return `/api/user-preferences/${key}`;
};

export const MAKE_USER_PREFERENCE_CRUD_CONFIG = (key: UserPreferencesKeys) => {
  return MAKE_CRUD_CONFIG({
    path: "N/A",
    plural: `${USER_PREFERENCES_CONFIG[key].label} Preference `,
    singular: `${USER_PREFERENCES_CONFIG[key].label} Preference `,
  });
};

export function useUserPreference<T>(key: UserPreferencesKeys) {
  const isAuthenticated = useIsAuthenticatedStore(
    (store) => store.isAuthenticated
  );

  return useStorageApi<T>(userPrefrencesApiPath(key), {
    enabled: isAuthenticated === true,
    returnUndefinedOnError: true,
    errorMessage: MAKE_USER_PREFERENCE_CRUD_CONFIG(key).TEXT_LANG.NOT_FOUND,
    defaultData: USER_PREFERENCES_CONFIG[key].defaultValue as T,
    selector: (data) => data.data,
  });
}

interface IUpsertConfigMutationOptions {
  otherEndpoints: string[];
}

export function useUpsertUserPreferenceMutation<T>(
  key: UserPreferencesKeys,
  mutationOptions?: IUpsertConfigMutationOptions
) {
  const apiMutateOptions = useWaitForResponseMutationOptions<T>({
    endpoints: [
      userPrefrencesApiPath(key),
      ...(mutationOptions?.otherEndpoints || []),
    ],
    onSuccessActionWithFormData: (data) => {
      AppStorage.set(userPrefrencesApiPath(key), data);
    },
    successMessage: MAKE_USER_PREFERENCE_CRUD_CONFIG(key).MUTATION_LANG.SAVED,
  });

  return useMutation(async (values: T) => {
    await makeActionRequest("PUT", userPrefrencesApiPath(key), {
      data: values,
    });
    return values;
  }, apiMutateOptions);
}
