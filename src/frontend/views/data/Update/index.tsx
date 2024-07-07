import { ContentLayout } from "@/components/app/content-layout";
import { SectionBox } from "@/components/app/section-box";
import { AppLayout } from "@/frontend/_layouts/app";
import { useUserHasPermission } from "@/frontend/hooks/auth/user.store";
import {
  useEntityDataDetails,
  useEntityDataUpdationMutation,
} from "@/frontend/hooks/data/data.store";
import {
  useEntityCrudConfig,
  useEntityId,
  useEntitySlug,
} from "@/frontend/hooks/entity/entity.config";
import { useNavigationStack } from "@/frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import {
  META_USER_PERMISSIONS,
  UserPermissions,
} from "@/shared/constants/user";

import { useEntityActionMenuItems } from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";
import { PortalEntityFormComponent } from "../portal";
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

  const actionItems = useEntityActionMenuItems(entity);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.EDIT,
    viewKey: "UPDATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const userHasPermission = useUserHasPermission();

  const dataDetails = useEntityDataDetails({ entity, entityId });

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <ContentLayout.Center>
        <SectionBox
          title={entityCrudConfig.TEXT_LANG.EDIT}
          description={
            userHasPermission(UserPermissions.CAN_CONFIGURE_APP)
              ? `For security reasons, Any data that is hidden in details view will not show up here, So rememeber to toggle on all fields there if you want to update them here`
              : undefined
          }
          backLink={backLink}
        >
          <BaseEntityForm
            entity={entity}
            crudAction="update"
            systemIcon="Save"
            buttonText={entityCrudConfig.FORM_LANG.UPDATE}
            onSubmit={entityDataUpdationMutation.mutateAsync}
            initialValuesData={dataDetails}
          />
        </SectionBox>
      </ContentLayout.Center>
      <PortalEntityFormComponent />
    </AppLayout>
  );
}
