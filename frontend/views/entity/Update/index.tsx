import {
  ErrorAlert,
  FormSkeleton,
  SectionBox,
  SectionCenter,
  FormSkeletonSchema,
} from "@gothicgeeks/design-system";
import { SLUG_LOADING_VALUE, TitleLang } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { AppLayout } from "../../../_layouts/app";
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
import {
  useEntityFields,
  useEntityToOneReferenceFields,
} from "../../../hooks/entity/entity.store";
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
import { useEntityViewStateMachine } from "../useEntityViewStateMachine";

export function EntityUpdate() {
  const entity = useEntitySlug();
  const id = useEntityId();
  const entityDiction = useEntityDiction();

  useSetPageDetails({
    pageTitle: `Update ${entityDiction.plural}`,
    viewKey: "ENTITIES_DETAILS",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

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
  const entityToOneReferenceFields = useEntityToOneReferenceFields(entity);

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
    entityToOneReferenceFields.error ||
    entityFields.error;

  const isLoading =
    dataDetails.isLoading ||
    entityFieldTypesMap.isLoading ||
    hiddenUpdateColumns.isLoading ||
    entityToOneReferenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE ||
    entityFields.isLoading;

  const viewState = useEntityViewStateMachine(isLoading, error, "update");
  const { canGoBack, goBack } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
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
              entityToOneReferenceFields={entityToOneReferenceFields.data}
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
