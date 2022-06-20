import { useApiQueries } from "@gothicgeeks/shared";
import { useCallback } from "react";
import { userFriendlyCase } from "../../lib/strings";
import { configurationApiPath } from "../configuration/configration.store";

export function useEntityDictionPlurals<T, P extends keyof T>(
    input: T[],
    field: P
  ) {
    // Improvement for a Record<string, T> return for `.data` to remove need for `{}` default at usages
    const entityDictions = useApiQueries<T, {singular:string, plural: string}>(
      input,
      (accessor) => configurationApiPath('entity_diction', accessor as unknown as string),
      field,
    );
  
    return useCallback(
      (fieldName: string): string => {
        return entityDictions.data[fieldName]?.plural || userFriendlyCase(fieldName);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [entityDictions.data]
    );
  }