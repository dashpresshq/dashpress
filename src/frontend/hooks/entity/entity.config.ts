import { useCallback } from "react";
import { IFieldValidationItem } from "shared/validations/types";
import { IColorableSelection } from "shared/types/ui";
import {
  getEntityFieldTypes,
  getEntitySelections,
} from "shared/logic/entities";
import { DataCrudKeys } from "shared/types/data";
import {
  CRUD_HIDDEN_KEY_CONFIG,
  ORDER_FIELD_CONFIG,
} from "shared/configurations/permissions";
import { DataStateKeys } from "frontend/lib/data/types";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { uniqBy } from "shared/lib/array/uniq-by";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IEntityField } from "shared/types/db";
import { sortListByOrder } from "shared/lib/array/sort";
import { useEntityFields } from "./entity.store";
import {
  getFieldTypeBoundedValidations,
  guessEntityValidations,
} from "./guess";
import { useEntityConfiguration } from "../configuration/configuration.store";
import { usePortalHiddenEntityColumns } from "./portal";

export function useEntitySlug() {
  return useRouteParam("entity");
}

export function useEntityId() {
  return useRouteParam("id");
}

export function useEntityDiction(entity: string) {
  const entityDiction = useEntityConfiguration("entity_diction", entity);
  return {
    singular: entityDiction.data?.singular || userFriendlyCase(entity),
    plural: entityDiction.data?.plural || userFriendlyCase(entity),
  };
}

export function useEntityCrudConfig(entity: string) {
  const { singular, plural } = useEntityDiction(entity);

  return MAKE_CRUD_CONFIG({
    path: "N/A",
    plural,
    singular,
  });
}

export function useEntityFieldLabels(entity: string) {
  const entityFieldLabelsMap = useEntityConfiguration(
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

export function useProcessedEntityFieldTypes(
  entity: string
): Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP> {
  const entityFieldTypesMap = useEntityConfiguration(
    "entity_columns_types",
    entity
  );

  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entityFieldTypesMap.isError ||
    entityFieldTypesMap.isLoading
  ) {
    return {};
  }
  return getEntityFieldTypes(entityFields.data, entityFieldTypesMap.data);
}

export function useEntityFieldValidations(entity: string) {
  const entityValidationsMap = useEntityConfiguration(
    "entity_validations",
    entity
  );
  const processedEntityFieldTypes = useProcessedEntityFieldTypes(entity);
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
    entityFields.data.map((entityField) => {
      // The validation from the DB should override that of the config
      const preSelectedValidation =
        entityValidationsMap.data[entityField.name] || [];

      const uniqKey: keyof IFieldValidationItem = "validationType";
      return [
        entityField.name,
        uniqBy(
          [
            ...getFieldTypeBoundedValidations(
              processedEntityFieldTypes[entityField.name]
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

export function useEntityFieldSelections(
  entity: string
): Record<string, IColorableSelection[]> {
  const entitySelections = useEntityConfiguration("entity_selections", entity);
  const processedEntityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entitySelections.isError ||
    entitySelections.isLoading
  ) {
    return {};
  }

  return getEntitySelections(
    entityFields.data,
    entitySelections.data,
    processedEntityFieldTypes
  );
}

export function useEntityCrudSettings(entity: string) {
  return useEntityConfiguration("entity_crud_settings", entity, {
    create: false,
    details: false,
    delete: false,
    update: false,
  });
}

const filterOutHiddenScalarColumns = (
  scalarFields: IEntityField[],
  hiddenColumns: string[]
) => scalarFields.filter(({ name }) => !hiddenColumns.includes(name));

export const useEntityCrudFields = (
  entity: string,
  crudKey: DataCrudKeys
): DataStateKeys<IEntityField[]> => {
  const entityFields = useEntityFields(entity);

  const entityHiddenList = useEntityConfiguration(
    CRUD_HIDDEN_KEY_CONFIG[crudKey],
    entity
  );

  const entityOrderList = useEntityConfiguration(
    ORDER_FIELD_CONFIG[crudKey],
    entity
  );

  const portalHiddenEntities = usePortalHiddenEntityColumns(entity, crudKey);

  const columnsToShow = filterOutHiddenScalarColumns(entityFields.data, [
    ...portalHiddenEntities.data,
    ...entityHiddenList.data,
  ]);

  return {
    data: sortListByOrder(entityOrderList.data, columnsToShow, "name"),
    error:
      portalHiddenEntities.error ||
      entityHiddenList.error ||
      entityOrderList.error,
    isLoading:
      portalHiddenEntities.isLoading ||
      entityHiddenList.isLoading ||
      entityOrderList.isLoading,
  };
};
