import { AppLayout } from "../../../_layouts/app";
import {
  ErrorAlert,
  FormSkeleton,
  SectionBox,
  SectionCenter,
  Spacer,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityDiction,
  useEntityFieldLabels,
  useEntityFieldTypes,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import { useEntityDataCreationMutation } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { useEntityConfiguration } from "../../../hooks/configuration/configration.store";
import { CreateEntityForm } from "./CreateEntity.form";
import { fitlerOutHiddenScalarColumns } from "../utils";
import { IFieldValidationItem } from "../Configure/Fields/FieldsValidation";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityDataCreationMutation = useEntityDataCreationMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Create,
    EntityActionTypes.Types,
  ]);
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const entityValidationsMap = useEntityConfiguration<
    Record<string, IFieldValidationItem[]>
  >("entity_validations", entity);
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityFieldTypes = useEntityFieldTypes();

  const error =
    hiddenCreateColumns.error ||
    entityFieldTypesMap.error ||
    entityValidationsMap.error ||
    entityScalarFields.error;

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        { label: "Create", value: NAVIGATION_LINKS.ENTITY.CREATE(entity) },
      ]}
      titleNeedsContext={true}
      actionItems={actionItems}
    >
      <SectionCenter>
        {error ? (
          <>
            <Spacer />
            <Spacer />
          </>
        ) : null}
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          {hiddenCreateColumns.isLoading ||
          entityScalarFields.isLoading ||
          entityValidationsMap.isLoading ||
          entityFieldTypesMap.isLoading ? (
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Textarea,
              ]}
            />
          ) : (
            <>
              {error ? (
                <ErrorAlert message={error} />
              ) : (
                <CreateEntityForm
                  entityFieldTypes={entityFieldTypes}
                  entityValidationsMap={entityValidationsMap.data}
                  getEntityFieldLabels={getEntityFieldLabels}
                  onSubmit={entityDataCreationMutation.mutateAsync}
                  fields={fitlerOutHiddenScalarColumns(
                    entityScalarFields,
                    hiddenCreateColumns
                  )}
                />
              )}
            </>
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
