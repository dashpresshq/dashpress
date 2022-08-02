import {
  ErrorAlert,
  FormSkeleton,
  SectionBox,
  SectionCenter,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE, TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack } from "frontend/lib/routing/useGoBackContext";
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
import { useEntityFields } from "../../../hooks/entity/entity.store";
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
import { useViewStateMachine } from "../useViewStateMachine";

export function EntityUpdate() {
  const entity = useEntitySlug();
  const id = useEntityId();
  const entityDiction = useEntityDiction();
  const entityFields = useEntityFields(entity);
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
    entityFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityFieldTypesMap.isLoading ||
    hiddenUpdateColumns.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading;

  const viewState = useViewStateMachine(isLoading, error, "update");
  const { canGoBack, goBack } = useNavigationStack("Update Entity");

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
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
          {viewState.type === "loading" && (
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Textarea,
              ]}
            />
          )}
          {viewState.type === "error" && (
            <ErrorAlert message={viewState.message} />
          )}
          {viewState.type === "render" && (
            <UpdateEntityForm
              getEntityFieldLabels={getEntityFieldLabels}
              entityFieldTypes={entityFieldTypes}
              entityFieldSelections={entityFieldSelections}
              entityValidationsMap={entityValidationsMap}
              onSubmit={entityDataUpdationMutation.mutateAsync}
              fields={fitlerOutHiddenScalarColumns(
                entityFields,
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
