import {
  ButtonLang,
  DataStateKeys,
  SLUG_LOADING_VALUE,
} from "@hadmean/protozoa";
import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import {
  useEntityFields,
  useEntityToOneReferenceFields,
} from "frontend/hooks/entity/entity.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useProcessedEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { IFormExtension } from "frontend/components/SchemaForm/types";
import { useMemo } from "react";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { buildAppliedSchemaFormConfig } from "./buildAppliedSchemaFormConfig";
import { useEntityViewStateMachine } from "./useEntityViewStateMachine";
import { filterOutHiddenScalarColumns } from "./utils";

type IProps = {
  initialValues?: Record<string, unknown>;
  action: "create" | "update";
  hiddenColumns: DataStateKeys<string[]>;
  additionalDataState?: DataStateKeys<unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

export function BaseEntityForm({
  initialValues,
  action,
  additionalDataState,
  hiddenColumns,
  onSubmit,
}: IProps) {
  const entity = useEntitySlug();
  const entityValidationsMap = useEntityFieldValidations();
  const entityFields = useEntityFields(entity);
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityFieldTypes = useProcessedEntityFieldTypes();
  const entityFieldSelections = useEntityFieldSelections();
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const entityFormExtension = useEntityConfiguration<IFormExtension>(
    "entity_form_extension",
    entity
  );
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);

  const error =
    entityFieldTypesMap.error ||
    hiddenColumns.error ||
    additionalDataState?.error ||
    entityFormExtension.error ||
    entityToOneReferenceFields.error ||
    entityFields.error;

  const isLoading =
    entityFields.isLoading ||
    hiddenColumns.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entityFormExtension.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFieldTypesMap.isLoading ||
    additionalDataState?.isLoading;

  const viewState = useEntityViewStateMachine(isLoading, error, action);

  const fields = filterOutHiddenScalarColumns(
    (entityFields.data || []).filter(({ isId }) => !isId),
    hiddenColumns.data
  ).map(({ name }) => name);

  const fieldsInitialValues = useMemo(() => {
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
  }, [initialValues, hiddenColumns]);

  const formSchemaConfig = {
    entityToOneReferenceFields: entityToOneReferenceFields.data || {},
    getEntityFieldLabels,
    entityFieldTypes,
    entityFieldSelections,
    entityValidationsMap,
    fields,
  };

  return (
    <ViewStateMachine
      loading={viewState.type === "loading"}
      error={viewState.type === "error" ? viewState.message : undefined}
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
        buttonText={action === "update" ? ButtonLang.update : ButtonLang.create}
        resetForm={action === "create" ? true : undefined}
        onSubmit={onSubmit}
        action={action}
        initialValues={fieldsInitialValues}
        fields={buildAppliedSchemaFormConfig(formSchemaConfig)}
        formExtension={entityFormExtension.data}
      />
    </ViewStateMachine>
  );
}
