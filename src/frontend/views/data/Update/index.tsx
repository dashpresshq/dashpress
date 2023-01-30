import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/types/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import {
  useEntityDataDetails,
  useEntityDataUpdationMutation,
} from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";

export function EntityUpdate() {
  const id = useEntityId();
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();

  const entityDataUpdationMutation = useEntityDataUpdationMutation(entity, id);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Update,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: `Update ${entityDiction.plural}`,
    viewKey: "UPDATE_ENTITY",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

  const userHasPermission = useUserHasPermission();

  const hiddenUpdateColumns = useSelectedEntityColumns(
    "hidden_entity_update_columns"
  );

  const dataDetails = useEntityDataDetails(entity, id);

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit(entityDiction.singular)}
          description={
            userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)
              ? "For security reasons, Any data that is hidden in details view will not show up here, So rememeber to toggle on all fields there if you want to update them here"
              : undefined
          }
          backLink={backLink}
        >
          <BaseEntityForm
            action="update"
            onSubmit={entityDataUpdationMutation.mutateAsync}
            hiddenColumns={hiddenUpdateColumns}
            initialValues={dataDetails.data}
            additionalDataState={dataDetails}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
