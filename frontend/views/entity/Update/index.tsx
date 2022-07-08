import {
  ErrorAlert,
  FormSkeleton,
  SectionBox,
  SectionCenter,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { AppLayout } from "../../../_layouts/app";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityDiction,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityFieldTypes,
  useEntityFieldValidations,
  useEntityId,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../../hooks/entity/entity.store";
import {
  useEntityDataDetails,
  useEntityDataUpdationMutation,
} from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { useEntityConfiguration } from "../../../hooks/configuration/configration.store";
import { UpdateEntityForm } from "./UpdateEntity.form";
import { fitlerOutHiddenScalarColumns } from "../utils";

// TODO bounce if .update is not enabled
export function EntityUpdate() {
  const entity = useEntitySlug();
  const id = useEntityId();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityDataUpdationMutation = useEntityDataUpdationMutation(entity, id);
  const dataDetails = useEntityDataDetails(entity, id);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Update,
    EntityActionTypes.Types,
  ]);
  const entityFieldTypesMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_types",
    entity
  );
  const entityValidationsMap = useEntityFieldValidations();

  const entityFieldTypes = useEntityFieldTypes();

  const entityFieldSelections = useEntityFieldSelections();

  const hiddenUpdateColumns = useSelectedEntityColumns(
    "hidden_entity_update_columns"
  );
  const getEntityFieldLabels = useEntityFieldLabels();

  const error =
    dataDetails.error ||
    hiddenUpdateColumns.error ||
    entityFieldTypesMap.error ||
    entityScalarFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityFieldTypesMap.isLoading ||
    hiddenUpdateColumns.isLoading ||
    entityScalarFields.isLoading;

  return (
    <AppLayout
      titleNeedsContext
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        {
          label: entityDiction.singular,
          value: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
        },
        { label: "Update", value: NAVIGATION_LINKS.ENTITY.UPDATE(entity, id) },
      ]}
      actionItems={actionItems}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
            label: entityDiction.singular,
          }}
        >
          {isLoading && (
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Textarea,
              ]}
            />
          )}
          {error && <ErrorAlert message={error} />}
          {!isLoading && !error && (
            <UpdateEntityForm
              getEntityFieldLabels={getEntityFieldLabels}
              entityFieldTypes={entityFieldTypes}
              entityFieldSelections={entityFieldSelections}
              entityValidationsMap={entityValidationsMap}
              onSubmit={entityDataUpdationMutation.mutateAsync}
              fields={fitlerOutHiddenScalarColumns(
                entityScalarFields,
                hiddenUpdateColumns
              ).map(({ name }) => name)}
              initialValues={dataDetails.data}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
