import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { IActionButton } from "frontend/design-system/components/Button/ActionButtons/types";
import { CrudViewsKeys } from "shared/configurations";
import { useCanUserPerformCrudAction } from "./useCanUserPerformCrudAction";

export const useEntityActionButtons = ({
  entity,
  entityId,
  redirectAfterDelete,
  exclude = [],
}: {
  exclude?: CrudViewsKeys[];
  entity: string;
  entityId: string;
  redirectAfterDelete?: string;
}): IActionButton[] => {
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    {
      entity,
      entityId,
    },
    redirectAfterDelete
  );
  const actionButtons: IActionButton[] = [];

  if (canUserPerformCrudAction("details") && !exclude.includes("details")) {
    actionButtons.push({
      _type: "normal",
      icon: "eye",
      action: NAVIGATION_LINKS.ENTITY.DETAILS(entity, entityId),
      label: "Details",
      order: 10,
    });
  }

  if (canUserPerformCrudAction("update") && !exclude.includes("update")) {
    actionButtons.push({
      _type: "normal",
      icon: "edit",
      action: NAVIGATION_LINKS.ENTITY.UPDATE(entity, entityId),
      label: "Edit",
      order: 20,
    });
  }

  if (canUserPerformCrudAction("delete") && !exclude.includes("delete")) {
    actionButtons.push({
      _type: "delete",
      action: () => entityDataDeletionMutation.mutate(entityId),
      isMakingDeleteRequest:
        entityDataDeletionMutation.isLoading &&
        entityDataDeletionMutation.variables === entityId,
      shouldConfirmAlert: true,
      order: 30,
    });
  }

  return actionButtons;
};
