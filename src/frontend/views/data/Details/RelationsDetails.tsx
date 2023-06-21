import { SectionBox, SoftButton, Spacer, Typo } from "@hadmean/chromista";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
  useRouteParam,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityIdField,
  useEntityReferenceFields,
} from "frontend/hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import {
  useEntityDataDetails,
  useEntityDataReference,
} from "frontend/hooks/data/data.store";
import { useRouter } from "next/router";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityCrudConfig = useEntityCrudConfig(childEntity);
  const entityId = useEntityId();
  const parentEntity = useEntitySlug();
  const entityReferenceFields = useEntityReferenceFields(parentEntity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(childEntity);
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
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const detailsColumn = entityReferenceFields.isLoading
    ? SLUG_LOADING_VALUE
    : referenceColumn?.inverseToOneField;

  const currentEntityData = useEntityDataDetails(parentEntity, entityId);

  const viewEntityId = referenceColumn?.inverseToOneField
    ? entityId
    : currentEntityData.data[referenceColumn?.field];

  const dataDetails = useEntityDataDetails(
    childEntity,
    viewEntityId,
    detailsColumn
  );

  const childEntityIdField = useEntityIdField(childEntity);

  const idData = dataDetails.data[childEntityIdField.data];

  const actions =
    childEntityIdField.isLoading || dataDetails.isLoading
      ? []
      : [
          {
            icon: "eye" as const,
            action: NAVIGATION_LINKS.ENTITY.DETAILS(childEntity, idData),
            label: "Details",
            crudSetting: canUserPerformCrudAction("details"),
          },
          {
            icon: "edit" as const,
            action: NAVIGATION_LINKS.ENTITY.UPDATE(childEntity, idData),
            label: "Edit",
            crudSetting: canUserPerformCrudAction("update"),
          },
        ];

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
            entityDataReference.isLoading || entityDataReference.isIdle
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
            entityDataReference.isLoading || entityDataReference.isIdle
          }
          backLink={backLink}
          iconButtons={actions.filter(({ crudSetting }) => crudSetting)}
        >
          <EntityDetailsView
            displayFrom="details"
            id={viewEntityId}
            entity={childEntity}
            column={detailsColumn}
          />
        </SectionBox>
      )}
    </DetailsLayout>
  );
}
