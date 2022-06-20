import { useRouter } from "next/router";
import { Icon, Plus, Save } from "react-feather";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";

export enum EntityActionTypes {
  CRUD,
  Actions,
  Diction,
  Fields,
}

const ENTITY_ACTION_BAG: Record<
  EntityActionTypes,
  {
    label: string;
    IconComponent: Icon;
    link: (entity: string) => string;
  }
> = {
  [EntityActionTypes.CRUD]: {
    label: "CRUD Settings",
    IconComponent: Plus,
    link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD,
  },
  [EntityActionTypes.Actions]: {
    label: "Table Settings",
    IconComponent: Save,
    link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS,
  },
  [EntityActionTypes.Diction]: {
    label: "Diction Settings",
    IconComponent: Save,
    link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION,
  },
  [EntityActionTypes.Fields]: {
    label: "Fields Settings",
    IconComponent: Save,
    link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION,
  },
};

export const useEntityActionMenuItems = (actionTypes: EntityActionTypes[]) => {
  const router = useRouter();
  const slugEntity = useEntitySlug();

  return actionTypes.map((actionType) => {
    const { link, ...actionBag } = ENTITY_ACTION_BAG[actionType];
    return {
      ...actionBag,
      onClick: () => {
        router.push(link(slugEntity));
      },
    };
  });
};
