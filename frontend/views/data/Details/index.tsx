import { SectionBox } from "@adminator/chromista";
import { TitleLang } from "@adminator/protozoa";
import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout, DETAILS_LAYOUT_KEY } from "./_Layout";

export function EntityDetails() {
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityCrudSettings();
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    entity,
    NAVIGATION_LINKS.ENTITY.TABLE(entity)
  );

  const { canGoBack, goBack } = useNavigationStack();

  useSetPageDetails({
    pageTitle: `${entityDiction.singular} Details`,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

  return (
    <DetailsLayout entity={entity} menuKey={DETAILS_LAYOUT_KEY}>
      <SectionBox
        title={TitleLang.details(entityDiction.singular)}
        backLink={
          canGoBack()
            ? {
                action: goBack,
                label: "Go Back",
              }
            : undefined
        }
        deleteAction={{
          action: entityCrudSettings.data?.delete
            ? () => entityDataDeletionMutation.mutate(id)
            : undefined,

          isMakingDeleteRequest: entityDataDeletionMutation.isLoading,
        }}
        iconButtons={
          entityCrudSettings.data?.update
            ? [
                {
                  icon: "edit",
                  action: NAVIGATION_LINKS.ENTITY.UPDATE(entity, id),
                  label: "Edit",
                },
              ]
            : []
        }
      >
        <EntityDetailsView displayFrom="details" id={id} entity={entity} />
      </SectionBox>
    </DetailsLayout>
  );
}
