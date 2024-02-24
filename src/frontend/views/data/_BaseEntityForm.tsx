import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityToOneReferenceFields } from "frontend/hooks/entity/entity.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityFieldValidations,
  useEntityCrudFields,
} from "frontend/hooks/entity/entity.config";
import { useMemo } from "react";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { DataStateKeys, DataStates } from "frontend/lib/data/types";
import { SystemIconsKeys } from "shared/constants/Icons";
import { buildAppliedSchemaFormConfig } from "./buildAppliedSchemaFormConfig";
import { useEntityViewStateMachine } from "./hooks/useEntityViewStateMachine";
import { usePortalExtendEntityFormConfig } from "./portal";
import { useIsEntityFieldMutatable } from "./hooks/useIsEntityFieldMutatable";

type IProps = {
  entity: string;
  initialValuesData?: DataStateKeys<Record<string, unknown>>;
  crudAction: "create" | "update";
  allOptional?: boolean;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  resetForm?: true;
  buttonText: (submitting: boolean) => string;
  systemIcon: SystemIconsKeys;
  fieldsToShow?: string[];
};

export function BaseEntityForm({
  entity,
  initialValuesData,
  crudAction,
  allOptional,
  systemIcon,
  resetForm,
  buttonText,
  onSubmit,
  fieldsToShow,
}: IProps) {
  const entityValidationsMap = useEntityFieldValidations(entity);
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);
  const entityFieldTypesMap = useEntityConfiguration(
    "entity_columns_types",
    entity
  );
  const entityCrudFields = useEntityCrudFields(entity, crudAction);

  const extendEntityFormConfig = usePortalExtendEntityFormConfig(
    entity,
    crudAction
  );

  const isEntityFieldMutatable = useIsEntityFieldMutatable(crudAction);

  const entityFormExtension = useEntityConfiguration(
    "entity_form_extension",
    entity
  );
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);

  const error =
    entityFieldTypesMap.error ||
    entityCrudFields.error ||
    initialValuesData?.error ||
    entityFormExtension.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    entityCrudFields.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entityFormExtension.isLoading ||
    entityFieldTypesMap.isLoading ||
    extendEntityFormConfig === "loading" ||
    initialValuesData?.isLoading;

  const viewState = useEntityViewStateMachine({
    isLoading,
    error,
    crudAction,
    entity,
  });

  const fields = entityCrudFields.data
    .filter(isEntityFieldMutatable)
    .map(({ name }) => name);

  const fieldsInitialValues = useMemo(() => {
    const initialValues = initialValuesData?.data;
    if (!initialValues) {
      return initialValues;
    }
    return Object.fromEntries(
      fields.map((field) => {
        let value = initialValues[field];

        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value);
        }

        return [field, value];
      })
    );
  }, [initialValuesData, entityCrudFields.data]);

  const formSchemaConfig = {
    entityToOneReferenceFields: entityToOneReferenceFields.data,
    getEntityFieldLabels,
    entityFieldTypes,
    entityFieldSelections,
    entityValidationsMap,
    fields,
  };

  const formConfig = buildAppliedSchemaFormConfig(formSchemaConfig, {
    allOptional,
    fieldsToShow,
  });

  return (
    <ViewStateMachine
      loading={viewState.type === DataStates.Loading}
      error={
        viewState.type === DataStates.Error ? viewState.message : undefined
      }
      loader={
        <FormSkeleton
          schema={[
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Textarea,
          ]}
        />
      }
    >
      <SchemaForm
        buttonText={buttonText}
        resetForm={resetForm}
        onSubmit={onSubmit}
        action={crudAction}
        systemIcon={systemIcon}
        initialValues={fieldsInitialValues}
        fields={
          extendEntityFormConfig === "loading"
            ? formConfig
            : extendEntityFormConfig(formConfig)
        }
        formExtension={entityFormExtension.data}
      />
    </ViewStateMachine>
  );
}
