import { useRouter } from "next/router";
import { Icon, Save, Settings } from "react-feather";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { CrudViewsKeys } from "shared/configurations";

export const ENTITY_CONFIGURATION_VIEW = "ENTITY_CONFIGURATION_VIEW";

export const ENTITY_FIELD_SETTINGS_TAB_LABELS = {
  LABELS: "Labels",
  FORM: "Form",
  ORDER: "Order",
};

export const ENTITY_CRUD_LABELS: Record<CrudViewsKeys, string> = {
  create: "Create",
  update: "Update",
  details: "Details",
  table: "Table",
  delete: "Delete",
};

export enum EntityActionTypes {
  Update,
  Create,
  Table,
  Details,
  Form,
  Diction,
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
  [EntityActionTypes.Labels]: {
    label: "Labels Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
      }),
  },
  [EntityActionTypes.Form]: {
    label: "Form Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.FORM,
      }),
  },
  [EntityActionTypes.Update]: {
    label: "Update Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.update,
      }),
  },
  [EntityActionTypes.Create]: {
    label: "Create Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.create,
      }),
  },
  [EntityActionTypes.Table]: {
    label: "Table Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.table,
      }),
  },
  [EntityActionTypes.Details]: {
    label: "Details Settings",
    IconComponent: Settings,
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.details,
      }),
  },
  [EntityActionTypes.Diction]: {
    label: "Diction Settings",
    IconComponent: Save,
    link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION,
  },
};

export const useEntityActionMenuItems = (
  actionTypes: EntityActionTypes[],
  slugEntity: string
) => {
  const router = useRouter();

  const userHasPermission = useUserHasPermission();

  if (!userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)) {
    return [];
  }

  if (!router.isReady) {
    return [];
  }

  return actionTypes.map((actionType) => {
    const { link, ...actionBag } = ENTITY_ACTION_BAG[actionType];
    return {
      id: `${slugEntity} ${actionBag.label}`,
      ...actionBag,
      onClick: () => {
        router.push(link(slugEntity));
      },
    };
  });
};
