import { SectionBox } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
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
  const userHasPermission = useUserHasPermission();
  const entityCrudSettings = useEntityCrudSettings();
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    entity,
    NAVIGATION_LINKS.ENTITY.TABLE(entity)
  );

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: `${entityDiction.singular} Details`,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      entity,
      GranularEntityPermissions.Show
    ),
  });

  return (
    <DetailsLayout entity={entity} menuKey={DETAILS_LAYOUT_KEY}>
      <SectionBox
        title={TitleLang.details(entityDiction.singular)}
        backLink={backLink}
        deleteAction={
          entityCrudSettings.data?.delete &&
          userHasPermission(
            META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
              entity,
              GranularEntityPermissions.Delete
            )
          )
            ? {
                action: () => entityDataDeletionMutation.mutate(id),
                isMakingDeleteRequest: entityDataDeletionMutation.isLoading,
              }
            : undefined
        }
        iconButtons={
          entityCrudSettings.data?.update &&
          userHasPermission(
            META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
              entity,
              GranularEntityPermissions.Update
            )
          )
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
