import { useRouter } from "next/router";
import { Icon, Save, Settings } from "react-feather";
import { useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";

export enum EntityActionTypes {
  Update,
  Create,
  Table,
  Details,
  Types,
  Diction,
  Validations,
  Labels,
}

const ENTITY_ACTION_BAG: Record<
  EntityActionTypes,
  {
    label: string;
    IconComponent: Icon;
    link: (entity: string) => string;
  }
> = {
  [EntityActionTypes.Update]: {
    label: "Update Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, { tab: "Update" }),
  },
  [EntityActionTypes.Validations]: {
    label: "Validations Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, { tab: "Validations" }),
  },
  [EntityActionTypes.Labels]: {
    label: "Labels Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, { tab: "Labels" }),
  },
  [EntityActionTypes.Types]: {
    label: "Types Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, { tab: "Types" }),
  },
  [EntityActionTypes.Create]: {
    label: "Create Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, { tab: "Create" }),
  },
  [EntityActionTypes.Table]: {
    label: "Table Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, { tab: "Table" }),
  },
  [EntityActionTypes.Details]: {
    label: "Details Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, { tab: "Details" }),
  },
  [EntityActionTypes.Diction]: {
    label: "Diction Settings",
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
