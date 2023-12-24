import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { AppLayout } from "frontend/_layouts/app";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
  useHiddenEntityColumns,
} from "frontend/hooks/entity/entity.config";
import {
  useEntityDataDetails,
  useEntityDataUpdationMutation,
} from "frontend/hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";
import { useDataUpdateActions } from "./portal";

export function EntityUpdate() {
  const entityId = useEntityId();
  const entity = useEntitySlug();

  useDataUpdateActions({ entity, entityId });

  const entityCrudConfig = useEntityCrudConfig(entity);

  const entityDataUpdationMutation = useEntityDataUpdationMutation(
    entity,
    entityId
  );

  const actionItems = useEntityActionMenuItems(
    [EntityActionTypes.Update, EntityActionTypes.Form],
    entity
  );

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.EDIT,
    viewKey: "UPDATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const userHasPermission = useUserHasPermission();

  const hiddenUpdateColumns = useHiddenEntityColumns("update", entity);

  const dataDetails = useEntityDataDetails({ entity, entityId });

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <ContentLayout.Center>
        <SectionBox
          title={entityCrudConfig.TEXT_LANG.EDIT}
          description={
            userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)
              ? `For security reasons, Any data that is hidden in details view will not show up here, So rememeber to toggle on all fields there if you want to update them here`
              : undefined
          }
          backLink={backLink}
        >
          <BaseEntityForm
            entity={entity}
            crudAction="update"
            icon="save"
            buttonText={entityCrudConfig.FORM_LANG.UPDATE}
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
