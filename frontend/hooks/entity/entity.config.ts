import { useEntityConfiguration } from "../configuration/configration.store";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { useApiQueries, useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "./entity.store";
import { ENTITY_TYPES_SELECTION_BAG } from "../../../shared/validations.constants";
import { userFriendlyCase } from "../../lib/strings";
import { IFieldValidationItem } from "frontend/views/entity/Configure/Fields/FieldsValidation";
import uniqBy from "lodash/uniqBy";
import {
  getFieldTypeBoundedValidations,
  guessEntityType,
  guessEntityValidations,
} from "./guess";
import { IColorableSelection } from "frontend/views/entity/Configure/Fields/types";
import {
  isUseColorsFlagOn,
  SYSTEM_COLORS,
} from "frontend/views/entity/Configure/Fields/selection.utils";
import { EntityTypesForSelection } from "frontend/views/entity/Configure/Fields/FieldsSelection";
import { ConfigrationStorage } from "../configuration/storage";

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
        entityFieldLabelsMap.data?.[fieldName] || userFriendlyCase(fieldName)
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
  const entityFieldTypes = useEntityFieldTypes();
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

function useEntityEnumOptions() {
  const entity = useEntitySlug();
  const entityScalarFields = useEntityScalarFields(entity);

  const enumNames = (entityScalarFields.data || [])
    .filter(({ kind }) => kind === "enum")
    .map(({ type }) => ({ type }));

  const cacheKey = "enum_list";

  return useApiQueries({
    input: enumNames,
    accessor: "type",
    pathFn: (enumName) => `/api/enums/${enumName}`,
    placeholderDataFn: (enumName) =>
      ConfigrationStorage.get(cacheKey, enumName),
    // TODO revert on upgrade
    // dataTransformer: (data: Record<string, unknown>, enumName: string) => {
    //   ConfigrationStorage.set(data, cacheKey, enumName)
    //   return data;
    // }
  });
}

export function useEntityFieldSelections() {
  const entity = useEntitySlug();
  const entitySelections = useEntityConfiguration<
    Record<string, IColorableSelection[]>
  >("entity_selections", entity);
  const entityFieldTypes = useEntityFieldTypes();
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
          ENTITY_TYPES_SELECTION_BAG[entityFieldTypes[name]].configureSelection
      )
      .map(({ name, type }) => {
        const preSelectedType = (entitySelections.data || {})[name];

        const entityType = entityFieldTypes[name] as EntityTypesForSelection;

        let selections: IColorableSelection[] = [];

        switch (entityType) {
          case "boolean":
            selections = preSelectedType ?? [
              {
                value: true,
                label: "Yes",
                color: "#ff0",
              },
              {
                value: false,
                label: "No",
                color: "#00f",
              },
            ];
            break;
          case "selection":
            selections = preSelectedType ?? [];
            break;

          case "reference":
            selections = preSelectedType ?? [];
            break;

          case "selection-enum":
            const preselection = preSelectedType ?? [];

            const shouldUseColor = isUseColorsFlagOn(preselection);
            const enumsFromDb = enumOptions.data[type].data || [];

            selections = uniqBy(
              [
                ...enumsFromDb.map((enumValue, index) => ({
                  value: enumValue,
                  label: userFriendlyCase(enumValue),
                  color: shouldUseColor ? SYSTEM_COLORS[index] : undefined,
                })),
                ...preselection,
              ],
              "value"
            );

            break;
        }

        return [name, selections];
      })
  );
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
  >,
  overrideEntity?: string
) {
  const entity = useEntitySlug();
  return useEntityConfiguration<string[]>(key, overrideEntity || entity);
}
