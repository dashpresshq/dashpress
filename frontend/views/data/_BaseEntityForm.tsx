import {
  ButtonLang,
  DataStateKeys,
  SLUG_LOADING_VALUE,
} from "@gothicgeeks/shared";
import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { useEntityConfiguration } from "frontend/hooks/configuration/configration.store";
import {
  useEntityFields,
  useEntityToOneReferenceFields,
} from "frontend/hooks/entity/entity.store";
import {
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useEntityFieldValidations,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { buildAppliedSchemaFormConfig } from "./buildAppliedSchemaFormConfig";
import { useEntityViewStateMachine } from "./useEntityViewStateMachine";
import { fitlerOutHiddenScalarColumns } from "./utils";

type IProps = {
  initialValues?: Record<string, unknown>;
  action: "create" | "update";
  hiddenColumns: DataStateKeys<string[]>;
  additionalDataState?: DataStateKeys<unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

// TODO Send only changed fields for 'update' action
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
  const entityFieldTypes = useEntityFieldTypes();
  const entityFieldSelections = useEntityFieldSelections();
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);

  const error =
    entityFieldTypesMap.error ||
    hiddenColumns.error ||
    additionalDataState?.error ||
    entityToOneReferenceFields.error ||
    entityFields.error;

  const isLoading =
    entityFields.isLoading ||
    hiddenColumns.isLoading ||
    additionalDataState?.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFieldTypesMap.isLoading;

  const viewState = useEntityViewStateMachine(isLoading, error, "create");

  const formSchemaConfig = {
    entityToOneReferenceFields: entityToOneReferenceFields.data,
    getEntityFieldLabels,
    entityFieldTypes,
    entityFieldSelections,
    entityValidationsMap,
    fields: fitlerOutHiddenScalarColumns(entityFields, hiddenColumns).map(
      ({ name }) => name
    ),
  };

  if (viewState.type === "loading") {
    return (
      <FormSkeleton
        schema={[
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Textarea,
        ]}
      />
    );
  }

  if (viewState.type === "error") {
    <ErrorAlert message={viewState.message} />;
  }

  return (
    <SchemaForm
      buttonText={action === "update" ? ButtonLang.update : ButtonLang.create}
      resetForm={action === "create" ? true : undefined}
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={buildAppliedSchemaFormConfig(formSchemaConfig)}
    />
  );
}
