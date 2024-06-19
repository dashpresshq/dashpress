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
import { DataStateKeys, DataStates } from "frontend/lib/data/types";
import { SystemIconsKeys } from "shared/constants/Icons";
import { MessageDescriptor } from "@lingui/core";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SchemaForm } from "@/components/app/form/schema";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { buildAppliedSchemaFormConfig } from "./buildAppliedSchemaFormConfig";
import { useEntityViewStateMachine } from "./hooks/useEntityViewStateMachine";
import { usePortalExtendEntityFormConfig } from "./portal";
import { useIsEntityFieldMutatable } from "./hooks/useIsEntityFieldMutatable";

type IProps = {
  entity: string;
  initialValuesData?: DataStateKeys<Record<string, unknown>>;
  crudAction: "create" | "update";
  allOptional?: boolean;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
  resetForm?: true;
  buttonText: (submitting: boolean) => MessageDescriptor;
  systemIcon: SystemIconsKeys;
  fieldsToShow?: string[];
  from?: string;
};

export const useEntityFormEditableFields = (
  entity: string,
  crudAction: "create" | "update"
): DataStateKeys<string[]> => {
  const isEntityFieldMutatable = useIsEntityFieldMutatable(crudAction);
  const entityCrudFields = useEntityCrudFields(entity, crudAction);

  return {
    error: entityCrudFields.error,
    isLoading: entityCrudFields.isLoading,
    data: entityCrudFields.data
      .filter(isEntityFieldMutatable)
      .map(({ name }) => name),
  };
};

export function BaseEntityForm({
  entity,
  initialValuesData,
  crudAction,
  allOptional,
  systemIcon,
  resetForm,
  buttonText,
  from,
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

  const editableFields = useEntityFormEditableFields(entity, crudAction);

  const extendEntityFormConfig = usePortalExtendEntityFormConfig(
    entity,
    crudAction
  );

  const entityFormExtension = useEntityConfiguration(
    "entity_form_extension",
    entity
  );
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);

  const error =
    entityFieldTypesMap.error ||
    initialValuesData?.error ||
    editableFields?.error ||
    entityFormExtension.error ||
    entityToOneReferenceFields.error;

  const isLoading =
    entityToOneReferenceFields.isLoading ||
    entityFormExtension.isLoading ||
    entityFieldTypesMap.isLoading ||
    editableFields.isLoading ||
    extendEntityFormConfig === "loading" ||
    initialValuesData?.isLoading;

  const viewState = useEntityViewStateMachine({
    isLoading,
    error,
    crudAction,
    entity,
  });

  const fieldsInitialValues = useMemo(() => {
    const initialValues = initialValuesData?.data;
    if (!initialValues) {
      return initialValues;
    }
    return Object.fromEntries(
      editableFields.data.map((field) => {
        let value = initialValues[field];

        if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value);
        }

        return [field, value];
      })
    );
  }, [initialValuesData, editableFields.data]);

  const formSchemaConfig = {
    entityToOneReferenceFields: entityToOneReferenceFields.data,
    getEntityFieldLabels,
    entityFieldTypes,
    entityFieldSelections,
    entityValidationsMap,
    fields: editableFields.data,
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
        from={from}
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
