import { useCallback } from "react";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import { AppStorage } from "frontend/lib/storage/app";
import { ISingularPlural } from "shared/types/config";
import { configurationApiPath } from "../configuration/configuration.store";

export function useEntityDictionPlurals<T, P extends keyof T>(
  input: T[],
  field: P
) {
  const entityDictions = useApiQueries<T, ISingularPlural>({
    input,
    accessor: field,
    pathFn: (entity) =>
      configurationApiPath("entity_diction", entity as unknown as string),
    placeholderDataFn: (entity) =>
      AppStorage.get(
        configurationApiPath("entity_diction", entity as unknown as string)
      ),
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
