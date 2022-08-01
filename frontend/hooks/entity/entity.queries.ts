import { AppStorage, useApiQueries } from "@gothicgeeks/shared";
import { useCallback } from "react";
import { userFriendlyCase } from "../../lib/strings";
import { configurationApiPath } from "../configuration/configration.store";

export function useEntityDictionPlurals<T, P extends keyof T>(
  input: T[],
  field: P
) {
  const entityDictions = useApiQueries<T, { singular: string; plural: string }>(
    {
      input,
      accessor: field,
      pathFn: (entity) =>
        configurationApiPath("entity_diction", entity as unknown as string),
      placeholderDataFn: (entity) =>
        AppStorage.get("entity_diction", entity as unknown as string),
    }
  );

  return useCallback(
    (fieldName: string): string =>
      entityDictions.data[fieldName]?.data?.plural ||
      userFriendlyCase(fieldName),
    [entityDictions.data]
  );
}
