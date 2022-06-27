import { useEntityConfiguration } from "../configuration/configration.store";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { useRouteParam } from "@gothicgeeks/shared";
import { useCallback } from "react";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "./entity.store";
import { ENTITY_TYPES_SELECTION_BAG } from "../../../shared/validations.constants";
import { IEntityField } from "../../../backend/entities/types";
import { userFriendlyCase } from "../../lib/strings";
import { IFieldValidationItem } from "frontend/views/entity/Configure/Fields/FieldsValidation";
import uniqBy from "lodash/uniqBy";

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

const guessEntityValidations = (
  isUnique: IEntityField["isUnique"],
  isId: IEntityField["isId"],
  isRequired: IEntityField["isRequired"]
): IFieldValidationItem[] => {
  const validationItems: IFieldValidationItem[] = [];

  if (isUnique || isId) {
    validationItems.push({
      validationType: "unique",
      errorMessage: "Foo", // TODO check after save message
      fromSchema: true,
    });
  }

  if (isRequired) {
    validationItems.push({
      validationType: "required",
      errorMessage: "Foo",
      fromSchema: true,
    });
  }
  // TODO guess the maxLength/max

  return validationItems;
};

const guessEntityType = (
  name: string,
  kind: IEntityField["kind"],
  type: IEntityField["type"],
  entityReferenceMap: Record<string, string>
): keyof typeof ENTITY_TYPES_SELECTION_BAG => {
  if (entityReferenceMap[name]) {
    return "reference";
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
  >,
  overrideEntity?: string
) {
  const entity = useEntitySlug();
  return useEntityConfiguration<string[]>(key, overrideEntity || entity);
}
