import { SectionBox, ContentLayout } from "@hadmean/chromista";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
  useHiddenEntityColumns,
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
  const entityCrudConfig = useEntityCrudConfig();

  const entityDataUpdationMutation = useEntityDataUpdationMutation(entity, id);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Update,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.EDIT,
    viewKey: "UPDATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const userHasPermission = useUserHasPermission();

  const hiddenUpdateColumns = useHiddenEntityColumns("update");

  const dataDetails = useEntityDataDetails(entity, id);

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <ContentLayout.Center>
        <SectionBox
          title={entityCrudConfig.TEXT_LANG.EDIT}
          description={
            userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)
              ? "For security reasons, Any data that is hidden in details view will not show up here, So rememeber to toggle on all fields there if you want to update them here"
              : undefined
          }
          backLink={backLink}
        >
          <BaseEntityForm
            entity={entity}
            action="update"
            onSubmit={entityDataUpdationMutation.mutateAsync}
            hiddenColumns={hiddenUpdateColumns}
            initialValues={dataDetails.data}
            additionalDataState={dataDetails}
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
