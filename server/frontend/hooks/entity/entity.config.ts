import { capitalCase } from "change-case";
import { useEntityConfiguration } from "../configuration/configration.store";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";

export function useEntitySlug() {
  return useRouteParam("entity");
}

export function useEntityId() {
  return useRouteParam("id");
}

export function useEntityDiction() {
  const entity = useEntitySlug();
  const entityDiction = useEntityConfiguration<{
    plural: string;
    singular: string;
  }>("entity_diction", entity);
  return {
    singular: entityDiction.data?.singular || capitalCase(entity),
    plural: entityDiction.data?.plural || capitalCase(entity),
  };
}

export function useEntityFieldLabels() {
  const entity = useEntitySlug();
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );

  return useCallback((fieldName: string): string => {
    if (entityFieldLabelsMap.error || entityFieldLabelsMap.isLoading) {
      return capitalCase(fieldName);
    }
    return entityFieldLabelsMap.data[fieldName] || capitalCase(fieldName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityFieldLabelsMap.isLoading]);
}

export interface IEntityCrudSettings {
  create: boolean;
  details: boolean;
  table: boolean;
  update: boolean;
  delete: boolean;
}

export function useEntityCrudSettings() {
  const entity = useEntitySlug();
  return useEntityConfiguration<IEntityCrudSettings>(
    "entity_crud_settings",
    entity
  );
}

export function useSelectedEntityColumns(
  key: keyof Pick<
    typeof CONFIGURATION_KEYS,
    | "hidden_entity_table_columns"
    | "hidden_entity_create_columns"
    | "hidden_entity_update_columns"
    | "hidden_entity_details_columns"
    | "relations_list_fields"
  >
) {
  const entity = useEntitySlug();
  return useEntityConfiguration<string[]>(key, entity);
}
