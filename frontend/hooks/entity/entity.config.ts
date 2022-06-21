import { useEntityConfiguration } from "../configuration/configration.store";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";
import { useEntityScalarFields } from "./entity.store";
import { ENTITY_TYPES_SELECTION_BAG } from "../../../shared/validations.constants";
import { IEntityField } from "../../../backend/entities/types";
import { userFriendlyCase } from "../../lib/strings";

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
    singular: entityDiction.data?.singular || userFriendlyCase(entity),
    plural: entityDiction.data?.plural || userFriendlyCase(entity),
  };
}

export function useEntityFieldLabels() {
  const entity = useEntitySlug();
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );

  return useCallback(
    (fieldName: string): string => {
      if (entityFieldLabelsMap.error || entityFieldLabelsMap.isLoading) {
        return userFriendlyCase(fieldName);
      }
      return (
        entityFieldLabelsMap.data[fieldName] || userFriendlyCase(fieldName)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entityFieldLabelsMap.isLoading]
  );
}

export function useEntityFieldTypes() {
  const entity = useEntitySlug();
  const entityFieldTypesMap = useEntityConfiguration<
    Record<string, keyof typeof ENTITY_TYPES_SELECTION_BAG>
  >("entity_columns_types", entity);

  const entityScalarFields = useEntityScalarFields(entity);
  if (
    entityScalarFields.isLoading ||
    entityScalarFields.isError ||
    entityFieldTypesMap.isError ||
    entityFieldTypesMap.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityScalarFields.data || []).map(({ name, type, kind }) => {
      return [name, getEntityType(entityFieldTypesMap.data, name, kind, type)];
    })
  );
}

const getEntityType = (
  entityFieldTypeMap: Record<string, keyof typeof ENTITY_TYPES_SELECTION_BAG>,
  name: string,
  kind: IEntityField["kind"],
  type: IEntityField["type"]
): keyof typeof ENTITY_TYPES_SELECTION_BAG => {
  const preSelectedType = entityFieldTypeMap[name];
  if (preSelectedType) {
    return preSelectedType;
  }
  // Start guessing
  if (kind === "enum") {
    return "selection";
  }

  const entityFieldType = FIELD_TYPE_TO_ENTITY_TYPES_MAP[type];

  if (entityFieldType) {
    return entityFieldType;
  }
  return "text";
};

const FIELD_TYPE_TO_ENTITY_TYPES_MAP: Record<
  IEntityField["type"],
  keyof typeof ENTITY_TYPES_SELECTION_BAG
> = {
  Boolean: "boolean",
  DateTime: "datetime-local",
  Int: "number",
  String: "text",
};

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
