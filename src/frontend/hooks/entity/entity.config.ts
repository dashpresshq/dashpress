import { useDomainMessages } from "frontend/lib/crud-config";
import type { DataStateKeys } from "frontend/lib/data/types";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useCallback } from "react";
import {
  CRUD_HIDDEN_KEY_CONFIG,
  ORDER_FIELD_CONFIG,
} from "shared/configurations/permissions";
import { sortListByOrder } from "shared/lib/array/sort";
import { uniqBy } from "shared/lib/array/uniq-by";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import {
  getEntityFieldTypes,
  getEntitySelections,
} from "shared/logic/entities";
import type { DataCrudKeys } from "shared/types/data";
import type { IEntityField } from "shared/types/db";
import type { IColorableSelection } from "shared/types/ui";
import type {
  FormFieldTypes,
  IFieldValidationItem,
} from "shared/validations/types";
import { fakeMessageDescriptor } from "translations/fake";

import { useEntityConfiguration } from "../configuration/configuration.store";
import { useEntityFields } from "./entity.store";
import {
  getFieldTypeBoundedValidations,
  guessEntityValidations,
} from "./guess";
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

  return useDomainMessages({
    plural: fakeMessageDescriptor(plural),
    singular: fakeMessageDescriptor(singular),
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
    [entityFieldLabelsMap]
  );
}

export function useProcessedEntityFieldTypes(
  entity: string
): Record<string, FormFieldTypes> {
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
      // The validation from the DB should override that of the config but keep the configured error message
      const preSelectedValidation =
        entityValidationsMap.data[entityField.name] || [];

      const preSelectedValidationMap = Object.fromEntries(
        preSelectedValidation.map((validation) => [
          validation.validationType,
          validation,
        ])
      );

      const replaceWithCustomErrorMessages = (
        validations: IFieldValidationItem[]
      ): IFieldValidationItem[] => {
        return validations.map((validation) => {
          return {
            ...validation,
            errorMessage:
              preSelectedValidationMap[validation.validationType]
                ?.errorMessage || validation.errorMessage,
          };
        });
      };

      const uniqKey: keyof IFieldValidationItem = "validationType";
      return [
        entityField.name,
        uniqBy(
          [
            ...replaceWithCustomErrorMessages(
              getFieldTypeBoundedValidations(
                processedEntityFieldTypes[entityField.name]
              )
            ),
            ...replaceWithCustomErrorMessages(
              guessEntityValidations(entityField)
            ),
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
