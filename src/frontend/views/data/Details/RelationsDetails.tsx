import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityIdField,
  useEntityReferenceFields,
} from "frontend/hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import {
  useEntityDataDetails,
  useEntityDataReference,
} from "frontend/hooks/data/data.store";
import { useRouter } from "next/router";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";
import { DetailsCanvas } from "../Table/_WholeEntityTable/DetailsCanvas";
import { useEntityActionButtons } from "../useEntityActionButtons";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityCrudConfig = useEntityCrudConfig(childEntity);
  const entityId = useEntityId();
  const parentEntity = useEntitySlug();
  const entityReferenceFields = useEntityReferenceFields(parentEntity);
  const entityDataReference = useEntityDataReference(parentEntity, entityId);
  const router = useRouter();

  const referenceColumn = entityReferenceFields.data.find(
    ({ table }) => table === childEntity
  );

  const { backLink } = useNavigationStack();

  const title =
    entityDataReference.isLoading || entityDataReference.isIdle
      ? childEntityCrudConfig.TEXT_LANG.SINGULAR
      : `${entityDataReference.data} - ${childEntityCrudConfig.TEXT_LANG.SINGULAR}`;

  useSetPageDetails({
    pageTitle: title,
    viewKey: ENTITY_DETAILS_VIEW_KEY(parentEntity),
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const detailsColumn = entityReferenceFields.isLoading
    ? SLUG_LOADING_VALUE
    : referenceColumn?.inverseToOneField;

  const currentEntityData = useEntityDataDetails({
    entity: parentEntity,
    entityId,
  });

  const viewEntityId = referenceColumn?.inverseToOneField
    ? entityId
    : currentEntityData.data[referenceColumn?.field];

  const dataDetails = useEntityDataDetails({
    entity: childEntity,
    entityId: viewEntityId,
    column: detailsColumn,
  });

  const childEntityIdField = useEntityIdField(childEntity);

  const idData = dataDetails.data[childEntityIdField.data];

  const actionButtons = useEntityActionButtons({
    entity: childEntity,
    id: idData,
    exclude: ["delete"],
  });

  return (
    <DetailsLayout
      entity={parentEntity}
      menuKey={childEntity}
      childEntity={childEntity}
    >
      {dataDetails.error ? (
        <SectionBox
          title={title}
          isLoading={
            entityDataReference.isLoading ||
            entityDataReference.isIdle ||
            childEntityIdField.isLoading ||
            dataDetails.isLoading
          }
          backLink={backLink}
        >
          <div style={{ textAlign: "center" }}>
            <Typo.SM>
              The {childEntityCrudConfig.TEXT_LANG.SINGULAR} for{" "}
              <b>{entityDataReference.data}</b> does not exist
            </Typo.SM>
            <Spacer />
            <SoftButton
              icon="add"
              label="Create It"
              action={() => {
                router.push(
                  `${NAVIGATION_LINKS.ENTITY.CREATE(
                    childEntity
                  )}?${detailsColumn}=${entityId}`
                );
              }}
            />
          </div>
        </SectionBox>
      ) : (
        <SectionBox
          title={title}
          isLoading={
            entityDataReference.isLoading ||
            entityDataReference.isIdle ||
            dataDetails.isLoading
          }
          backLink={backLink}
          actionButtons={actionButtons}
        >
          <EntityDetailsView
            displayFrom="details"
            id={viewEntityId}
            entity={childEntity}
            column={detailsColumn}
          />
        </SectionBox>
      )}
      <DetailsCanvas />
    </DetailsLayout>
  );
}
