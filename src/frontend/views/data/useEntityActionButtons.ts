import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { IActionButton } from "frontend/design-system/components/Button/ActionButtons/types";
import {
  CrudActionData,
  useCanUserPerformCrudAction,
} from "./useCanUserPerformCrudAction";

export const useEntityActionButtons = ({
  entity,
  id,
  redirectAfterDelete,
  exclude = [],
}: {
  exclude?: CrudActionData[];
  entity: string;
  id: string;
  redirectAfterDelete?: string;
}): IActionButton[] => {
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    entity,
    redirectAfterDelete
  );
  const actionButtons: IActionButton[] = [];

  if (canUserPerformCrudAction("details") && !exclude.includes("details")) {
    actionButtons.push({
      _type: "normal",
      icon: "eye",
      action: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
      label: "Details",
      order: 10,
    });
  }

  if (canUserPerformCrudAction("update") && !exclude.includes("update")) {
    actionButtons.push({
      _type: "normal",
      icon: "edit",
      action: NAVIGATION_LINKS.ENTITY.UPDATE(entity, id),
      label: "Edit",
      order: 20,
    });
  }

  if (canUserPerformCrudAction("delete") && !exclude.includes("delete")) {
    actionButtons.push({
      _type: "delete",
      action: () => entityDataDeletionMutation.mutate(id),
      isMakingDeleteRequest:
        entityDataDeletionMutation.isLoading &&
        entityDataDeletionMutation.variables === id,
      shouldConfirmAlert: true,
      order: 30,
    });
  }

  return actionButtons;
};
