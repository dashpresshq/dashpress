import { useCallback } from "react";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import type { AppConfigurationValueType } from "shared/configurations/constants";
import { configurationApiPath } from "../configuration/configuration.store";

export function useEntityDictionPlurals<T, P extends keyof T>(
  input: T[],
  field: P
) {
  const entityDictions = useApiQueries<
    T,
    AppConfigurationValueType<"entity_diction">
  >({
    input,
    accessor: field,
    persist: true,
    pathFn: (entity) =>
      configurationApiPath("entity_diction", entity as unknown as string),
  });

  return useCallback(
    (fieldName: string, singular?: boolean): string => {
      const data = entityDictions.data[fieldName]?.data;
      if (!data) {
        return userFriendlyCase(fieldName);
      }
      if (singular) {
        return data.singular || userFriendlyCase(fieldName);
      }
      return data.plural || userFriendlyCase(fieldName);
    },
    [entityDictions.data]
  );
}
