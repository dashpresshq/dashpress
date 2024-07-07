import { msg } from "@lingui/macro";

import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import type { IGroupActionButton } from "@/components/app/button/types";
import { useEntityDataDeletionMutation } from "@/frontend/hooks/data/data.store";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import type { CrudViewsKeys } from "@/shared/configurations";

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
}): IGroupActionButton[] => {
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(
    {
      entity,
      entityId,
    },
    redirectAfterDelete
  );
  const actionButtons: IGroupActionButton[] = [];

  if (canUserPerformCrudAction("details") && !exclude.includes("details")) {
    actionButtons.push({
      systemIcon: "Eye",
      action: NAVIGATION_LINKS.ENTITY.DETAILS(entity, entityId),
      label: msg`Details`,
      order: 10,
      id: "details",
    });
  }

  if (canUserPerformCrudAction("update") && !exclude.includes("update")) {
    actionButtons.push({
      id: "edit",
      systemIcon: "Edit",
      action: NAVIGATION_LINKS.ENTITY.UPDATE(entity, entityId),
      label: msg`Edit`,
      order: 20,
    });
  }

  if (canUserPerformCrudAction("delete") && !exclude.includes("delete")) {
    actionButtons.push({
      ...DELETE_BUTTON_PROPS({
        label: msg`Delete`,
        action: () => {
          entityDataDeletionMutation.mutate(entityId);
        },
        isMakingRequest:
          entityDataDeletionMutation.isPending &&
          entityDataDeletionMutation.variables === entityId,
      }),
      order: 30,
    });
  }

  return actionButtons;
};
