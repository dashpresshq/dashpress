import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout, DETAILS_LAYOUT_KEY } from "./_Layout";
import { DetailsCanvas } from "../Table/_WholeEntityTable/DetailsCanvas";
import { useDetailsViewMenuItems, usePortalActionButtons } from "./portal";
import { useEntityActionButtons } from "../hooks/useEntityActionButtons";

export function EntityDetails() {
  const entityId = useEntityId();
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig(entity);

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.DETAILS,
    viewKey: ENTITY_DETAILS_VIEW_KEY(entity),
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const menuItems = useDetailsViewMenuItems({
    entity,
    entityId,
  });

  const actionButtons = useEntityActionButtons({
    entity,
    entityId,
    redirectAfterDelete: NAVIGATION_LINKS.ENTITY.TABLE(entity),
    exclude: ["details"],
  });

  const portalActionButtons = usePortalActionButtons({
    entity,
    entityId,
    baseActionButtons: actionButtons,
    from: "details",
  });

  return (
    <DetailsLayout
      entity={entity}
      menuKey={DETAILS_LAYOUT_KEY}
      menuItems={menuItems}
    >
      <SectionBox
        title={entityCrudConfig.TEXT_LANG.DETAILS}
        backLink={backLink}
        actionButtons={portalActionButtons}
      >
        <EntityDetailsView
          displayFrom="details"
          id={entityId}
          entity={entity}
        />
      </SectionBox>
      <DetailsCanvas />
    </DetailsLayout>
  );
}
