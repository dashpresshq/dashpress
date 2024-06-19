import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityIdField,
  useEntityReferenceFields,
} from "frontend/hooks/entity/entity.store";
import { SYSTEM_LOADING_VALUE } from "frontend/lib/routing/constants";
import {
  useEntityDataDetails,
  useEntityDataReference,
} from "frontend/hooks/data/data.store";
import { useRouter } from "next/router";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { isQueryIdle } from "frontend/lib/data/useApi/utils";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";
import { SoftButton } from "@/components/app/button/soft";
import { SectionBox } from "@/components/app/section-box";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";
import { DetailsCanvas } from "../Table/_WholeEntityTable/DetailsCanvas";
import { useEntityActionButtons } from "../hooks/useEntityActionButtons";
import { usePortalActionButtons } from "./portal";

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

  const { _ } = useLingui();

  const { backLink } = useNavigationStack();

  const title =
    entityDataReference.isLoading || isQueryIdle(entityDataReference)
      ? childEntityCrudConfig.TEXT_LANG.SINGULAR
      : msg`${entityDataReference.data} - ${_(
          childEntityCrudConfig.TEXT_LANG.SINGULAR
        )}`;

  useSetPageDetails({
    pageTitle: title,
    viewKey: ENTITY_DETAILS_VIEW_KEY(parentEntity),
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const detailsColumn = entityReferenceFields.isLoading
    ? SYSTEM_LOADING_VALUE
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
    entityId: idData,
    exclude: ["delete"],
  });

  const portalActionButtons = usePortalActionButtons({
    entity: childEntity,
    entityId: idData,
    baseActionButtons: actionButtons,
    from: "details",
    row: dataDetails,
  });

  return (
    <DetailsLayout entity={parentEntity} menuKey={childEntity}>
      {dataDetails.error ? (
        <SectionBox
          title={title}
          isLoading={
            entityDataReference.isLoading ||
            (entityDataReference.status === "pending" &&
              entityDataReference.fetchStatus === "idle") ||
            childEntityIdField.isLoading ||
            dataDetails.isLoading
          }
          backLink={backLink}
        >
          <div className="text-center">
            <p className="text-sm mb-3">
              The {_(childEntityCrudConfig.TEXT_LANG.SINGULAR)} for{" "}
              <b>{entityDataReference.data}</b> does not exist
            </p>
            <SoftButton
              systemIcon="Plus"
              label={msg`Create It`}
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
            (entityDataReference.status === "pending" &&
              entityDataReference.fetchStatus === "idle") ||
            dataDetails.isLoading
          }
          backLink={backLink}
          actionButtons={portalActionButtons}
        >
          <EntityDetailsView
            displayFrom="details"
            entityId={idData}
            entity={childEntity}
          />
        </SectionBox>
      )}
      <DetailsCanvas />
    </DetailsLayout>
  );
}
