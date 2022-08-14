import { SectionBox } from "@gothicgeeks/design-system";
import { TitleLang, useRouteParam } from "@gothicgeeks/shared";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityDiction = useEntityDiction(childEntity);

  const childId = useRouteParam("childId");
  const entity = useEntitySlug();
  const childEntityCrudSettings = useEntityCrudSettings(childEntity);

  const { canGoBack, goBack } = useNavigationStack();

  useSetPageDetails({
    pageTitle: `${childEntityDiction.singular} Details`,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(childEntity),
  });

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <SectionBox
        title={TitleLang.details(childEntityDiction.singular)}
        backLink={
          canGoBack()
            ? {
                action: goBack,
                label: "Go Back",
              }
            : undefined
        }
        iconButtons={
          childEntityCrudSettings.data?.update
            ? [
                {
                  icon: "edit",
                  action: NAVIGATION_LINKS.ENTITY.UPDATE(childEntity, childId),
                  label: "Edit",
                },
              ]
            : []
        }
      >
        <EntityDetailsView
          displayFrom="details"
          id={childId}
          entity={childEntity}
        />
      </SectionBox>
    </DetailsLayout>
  );
}
