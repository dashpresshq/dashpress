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
  Labels,
}

export const ENTITY_FIELD_SETTINGS_TAB_LABELS = {
  LABELS: "Labels",
  TYPES: "Types",
  ORDER: "Order",
};

export const ENTITY_CRUD_SETTINGS_TAB_LABELS = {
  CREATE: "Create",
  UPDATE: "Update",
  DETAILS: "Details",
  TABLE: "Table",
  DELETE: "Delete",
};

const ENTITY_ACTION_BAG: Record<
  EntityActionTypes,
  {
    label: string;
    IconComponent: Icon;
    link: (entity: string) => string;
  }
> = {
  [EntityActionTypes.Labels]: {
    label: "Labels Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
      }),
  },
  [EntityActionTypes.Types]: {
    label: "Types Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.TYPES,
      }),
  },
  [EntityActionTypes.Update]: {
    label: "Update Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.UPDATE,
      }),
  },
  [EntityActionTypes.Create]: {
    label: "Create Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE,
      }),
  },
  [EntityActionTypes.Table]: {
    label: "Table Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.TABLE,
      }),
  },
  [EntityActionTypes.Details]: {
    label: "Details Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.DETAILS,
      }),
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
