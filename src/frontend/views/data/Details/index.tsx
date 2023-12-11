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
import { useEntityActionButtons } from "../useEntityActionButtons";

export function EntityDetails() {
  const entityCrudConfig = useEntityCrudConfig();
  const id = useEntityId();
  const entity = useEntitySlug();

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

  const actionButtons = useEntityActionButtons({
    entity,
    id,
    redirectAfterDelete: NAVIGATION_LINKS.ENTITY.TABLE(entity),
    exclude: ["table"],
  });

  const portalActionButtons = usePortalActionButtons({
    entity,
    entityId: id,
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
        actionButtons={[...actionButtons, ...portalActionButtons]}
      >
        <EntityDetailsView displayFrom="details" id={id} entity={entity} />
      </SectionBox>
      <DetailsCanvas />
    </DetailsLayout>
  );
}
