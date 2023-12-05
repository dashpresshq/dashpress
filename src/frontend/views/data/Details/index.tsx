import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { ISectionBoxIconButton } from "frontend/design-system/components/Section/SectionBox/types";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout, DETAILS_LAYOUT_KEY } from "./_Layout";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";
import { DetailsCanvas } from "../Table/_WholeEntityTable/DetailsCanvas";
import { useDetailsViewMenuItems, useSectionBoxIconButtons } from "./portal";

export function EntityDetails() {
  const entityCrudConfig = useEntityCrudConfig();
  const id = useEntityId();
  const entity = useEntitySlug();
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    entity,
    NAVIGATION_LINKS.ENTITY.TABLE(entity)
  );

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.DETAILS,
    viewKey: ENTITY_DETAILS_VIEW_KEY(entity),
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const menuItems = useDetailsViewMenuItems({
    entity,
    entityId: id,
  });

  const portalSectionBoxIconButtons = useSectionBoxIconButtons({
    entity,
    entityId: id,
  });

  const baseIconButtons: ISectionBoxIconButton[] = [];
  if (canUserPerformCrudAction("update")) {
    baseIconButtons.push({
      icon: "edit",
      action: NAVIGATION_LINKS.ENTITY.UPDATE(entity, id),
      label: "Edit",
      order: 10,
    });
  }

  return (
    <DetailsLayout
      entity={entity}
      menuKey={DETAILS_LAYOUT_KEY}
      menuItems={menuItems}
    >
      <SectionBox
        title={entityCrudConfig.TEXT_LANG.DETAILS}
        backLink={backLink}
        deleteAction={
          canUserPerformCrudAction("delete")
            ? {
                action: () => entityDataDeletionMutation.mutate(id),
                isMakingDeleteRequest: entityDataDeletionMutation.isLoading,
              }
            : undefined
        }
        iconButtons={[...baseIconButtons, ...portalSectionBoxIconButtons]}
      >
        <EntityDetailsView displayFrom="details" id={id} entity={entity} />
      </SectionBox>
      <DetailsCanvas />
    </DetailsLayout>
  );
}
