import { useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";
import uniqBy from "lodash/uniqBy";
import { IFieldValidationItem } from "shared/validations/types";
import { IColorableSelection } from "shared/types";
import { EntityTypesForSelection } from "frontend/views/entity/Fields/FieldsSelection";
import {
  getFieldTypeBoundedValidations,
  guessEntityType,
  guessEntityValidations,
} from "./guess";
import { userFriendlyCase } from "../../lib/strings";
import { FIELD_TYPES_CONFIG_MAP } from "../../../shared/validations";
import { useEntityFields } from "./entity.store";
import {
  CONFIGURATION_KEYS,
  IEntityCrudSettings,
} from "../../../shared/configuration.constants";
import { useEntityConfiguration } from "../configuration/configration.store";
import { getEntitySelectionConfig } from "./logic";

export function useEntitySlug(overrideValue?: string) {
  const routeParam = useRouteParam("entity");
  return overrideValue || routeParam;
}

export function useEntityId() {
  return useRouteParam("id");
}

export function useEntityDiction(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);
  const entityDiction = useEntityConfiguration<{
    plural: string;
    singular: string;
  }>("entity_diction", entity);
  return {
    singular: entityDiction.data?.singular || userFriendlyCase(entity),
    plural: entityDiction.data?.plural || userFriendlyCase(entity),
  };
}

export function useEntityFieldLabels(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);
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
        entityFieldLabelsMap.data?.[fieldName] || userFriendlyCase(fieldName)
      );
    },
    [entityFieldLabelsMap.data]
  );
}

export function useEntityFieldTypes(
  paramEntity?: string
): Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP> {
  const entity = useEntitySlug(paramEntity);
  const entityFieldTypesMap = useEntityConfiguration<
    Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>
  >("entity_columns_types", entity);

  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entityFieldTypesMap.isError ||
    entityFieldTypesMap.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityFields.data || []).map(({ name, type, isReference }) => {
      const preSelectedType = (entityFieldTypesMap.data || {})[name];

      return [name, preSelectedType ?? guessEntityType(type, isReference)];
    })
  );
}

export function useEntityFieldValidations() {
  const entity = useEntitySlug();
  const entityValidationsMap = useEntityConfiguration<
    Record<string, IFieldValidationItem[]>
  >("entity_validations", entity);
  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entityValidationsMap.isError ||
    entityValidationsMap.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityFields.data || []).map((entityField) => {
      // The validation from the DB should override that of the config
      const preSelectedValidation =
        (entityValidationsMap.data || {})[entityField.name] || [];

      const uniqKey: keyof IFieldValidationItem = "validationType";
      // Prefering the add new effect over remove old effect
      // Would be nice to reflect accurately
      // TODO if the maxLenghth/max changes then update that too :sweat
      return [
        entityField.name,
        uniqBy(
          [
            ...getFieldTypeBoundedValidations(
              entityFieldTypes[entityField.name]
            ),
            ...guessEntityValidations(entityField),
            ...preSelectedValidation,
          ],
          uniqKey
        ),
      ];
    })
  );
}

export function useEntityFieldSelections(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);

  const entitySelections = useEntityConfiguration<
    Record<string, IColorableSelection[]>
  >("entity_selections", entity);
  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityFields = useEntityFields(entity);
  const enumOptions = Object.fromEntries(
    (entityFields.data || [])
      .filter((field) => {
        return field.enumeration;
      })
      .map((field) => [field.name, field.enumeration])
  );

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entitySelections.isError ||
    entitySelections.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityFields.data || [])
      .filter(
        ({ name }) =>
          FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.configureSelection
      )
      .map(({ name }) => {
        const preSelectedType = (entitySelections.data || {})[name];

        const entityType = entityFieldTypes[name] as EntityTypesForSelection;

        return [
          name,
          getEntitySelectionConfig(
            entityType,
            preSelectedType,
            enumOptions[name]
          ),
        ];
      })
  );
}

export function useEntityCrudSettings(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);

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
  >,
  overrideEntity?: string
) {
  const entity = useEntitySlug();
  return useEntityConfiguration<string[]>(key, overrideEntity || entity);
}
