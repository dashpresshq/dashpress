import { SectionBox } from "@hadmean/chromista";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
  useRouteParam,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityDataReference } from "frontend/hooks/data/data.store";
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

  const column = entityReferenceFields.data.find(
    ({ table, inverseToOneField }) => table === childEntity && inverseToOneField
  )?.inverseToOneField;

  const { backLink } = useNavigationStack();

  const title = entityDataReference.isLoading
    ? childEntityCrudConfig.TEXT_LANG.SINGULAR
    : `${entityDataReference.data} - ${childEntityCrudConfig.TEXT_LANG.SINGULAR}`;

  useSetPageDetails({
    pageTitle: title,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const actions = [
    {
      icon: "eye" as const,
      action: NAVIGATION_LINKS.ENTITY.DETAILS(childEntity, "TODO: childId"),
      label: "Details",
      crudSetting: canUserPerformCrudAction("details"),
    },
    {
      icon: "edit" as const,
      action: NAVIGATION_LINKS.ENTITY.UPDATE(childEntity, "TODO: childId"),
      label: "Edit",
      crudSetting: canUserPerformCrudAction("update"),
    },
  ];
  // TODO if details === undefined, then show a create field and redirect back here
  return (
    <DetailsLayout entity={parentEntity} menuKey={childEntity}>
      <SectionBox
        title={title}
        isLoading={entityDataReference.isLoading}
        backLink={backLink}
        iconButtons={actions.filter(({ crudSetting }) => crudSetting)}
      >
        <EntityDetailsView
          displayFrom="details"
          id={entityId}
          entity={childEntity}
          column={entityReferenceFields.isLoading ? SLUG_LOADING_VALUE : column}
        />
      </SectionBox>
    </DetailsLayout>
  );
}
