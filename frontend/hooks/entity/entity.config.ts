import { useApiQueries, useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";
import { IFieldValidationItem } from "frontend/views/entity/Configure/Fields/FieldsValidation";
import uniqBy from "lodash/uniqBy";
import { IColorableSelection } from "frontend/views/entity/Configure/Fields/types";

import { EntityTypesForSelection } from "frontend/views/entity/Configure/Fields/FieldsSelection";
import {
  getFieldTypeBoundedValidations,
  guessEntityType,
  guessEntityValidations,
} from "./guess";
import { userFriendlyCase } from "../../lib/strings";
import { FIELD_TYPES_CONFIG_MAP } from "../../../shared/validations.constants";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "./entity.store";
import {
  CONFIGURATION_KEYS,
  IEntityCrudSettings,
} from "../../../shared/configuration.constants";
import { useEntityConfiguration } from "../configuration/configration.store";
import { ConfigrationStorage } from "../configuration/storage";
import { getEntitySelectionConfig } from "./logic";

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

export function useEntityFieldLabels(paramEntity?: string) {
  const entityFromSlug = useEntitySlug();
  const entity = paramEntity || entityFromSlug;
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
  const entitySlug = useEntitySlug();
  const entity = paramEntity || entitySlug;
  const entityFieldTypesMap = useEntityConfiguration<
    Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>
  >("entity_columns_types", entity);

  const entityScalarFields = useEntityScalarFields(entity);
  const entityReferenceFieldsMap = useEntityReferenceFields(entity);

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
      const preSelectedType = (entityFieldTypesMap.data || {})[name];

      return [
        name,
        preSelectedType ??
          guessEntityType(
            name,
            kind,
            type,
            entityReferenceFieldsMap.data || {}
          ),
      ];
    })
  );
}

export function useEntityFieldValidations() {
  const entity = useEntitySlug();
  const entityValidationsMap = useEntityConfiguration<
    Record<string, IFieldValidationItem[]>
  >("entity_validations", entity);
  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityScalarFields = useEntityScalarFields(entity);

  if (
    entityScalarFields.isLoading ||
    entityScalarFields.isError ||
    entityValidationsMap.isError ||
    entityValidationsMap.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityScalarFields.data || []).map(
      ({ name, isUnique, isId, isRequired }) => {
        // The validation from the DB should override that of the config
        const preSelectedValidation =
          (entityValidationsMap.data || {})[name] || [];

        const uniqKey: keyof IFieldValidationItem = "validationType";
        // Prefering the add new effect over remove old effect
        // Would be nice to reflect accurately
        // TODO if the maxLenghth/max changes then update that too :sweat
        return [
          name,
          uniqBy(
            [
              ...getFieldTypeBoundedValidations(entityFieldTypes[name]),
              ...guessEntityValidations(isUnique, isId, isRequired),
              ...preSelectedValidation,
            ],
            uniqKey
          ),
        ];
      }
    )
  );
}

function useEntityEnumOptions(paramEntity?: string) {
  const entitySlug = useEntitySlug();

  const entity = paramEntity || entitySlug;

  const entityScalarFields = useEntityScalarFields(entity);

  const enumNames = (entityScalarFields.data || [])
    .filter(({ kind }) => kind === "enum")
    .map(({ type }) => ({ type }));

  const cacheKey = "enum_list";

  return useApiQueries<{ type: string }, string[]>({
    input: enumNames,
    accessor: "type",
    pathFn: (enumName) => `/api/enums/${enumName}`,
    placeholderDataFn: (enumName) =>
      ConfigrationStorage.get(cacheKey, enumName),
    dataTransformer: (data: string[], enumName: string) => {
      ConfigrationStorage.set(data, cacheKey, enumName);
      return data;
    },
  });
}

export function useEntityFieldSelections(paramEntity?: string) {
  const entitySlug = useEntitySlug();

  const entity = paramEntity || entitySlug;

  const entitySelections = useEntityConfiguration<
    Record<string, IColorableSelection[]>
  >("entity_selections", entity);
  const entityFieldTypes = useEntityFieldTypes(entity);
  const entityScalarFields = useEntityScalarFields(entity);
  const enumOptions = useEntityEnumOptions();

  if (
    entityScalarFields.isLoading ||
    entityScalarFields.isError ||
    entitySelections.isError ||
    enumOptions.error ||
    enumOptions.isLoading ||
    entitySelections.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    (entityScalarFields.data || [])
      .filter(
        ({ name }) =>
          FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.configureSelection
      )
      .map(({ name, type }) => {
        const preSelectedType = (entitySelections.data || {})[name];

        const entityType = entityFieldTypes[name] as EntityTypesForSelection;

        return [
          name,
          getEntitySelectionConfig(
            entityType,
            preSelectedType,
            enumOptions.data[type]?.data
          ),
        ];
      })
  );
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
  >,
  overrideEntity?: string
) {
  const entity = useEntitySlug();
  return useEntityConfiguration<string[]>(key, overrideEntity || entity);
}
