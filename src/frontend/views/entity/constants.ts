import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { CrudViewsKeys } from "shared/configurations";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";

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
    link: (entity: string) => string;
  }
> = {
  [EntityActionTypes.Labels]: {
    label: "Labels Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
      }),
  },
  [EntityActionTypes.Form]: {
    label: "Form Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.FORM,
      }),
  },
  [EntityActionTypes.Update]: {
    label: "Update Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.update,
      }),
  },
  [EntityActionTypes.Create]: {
    label: "Create Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.create,
      }),
  },
  [EntityActionTypes.Table]: {
    label: "Table Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.table,
      }),
  },
  [EntityActionTypes.Details]: {
    label: "Details Settings",
    link: (entity) =>
      NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_LABELS.details,
      }),
  },
  [EntityActionTypes.Diction]: {
    label: "Diction Settings",
    link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION,
  },
};

export const useEntityActionMenuItems = (
  actionTypes: EntityActionTypes[],
  slugEntity: string
): IDropDownMenuItem[] => {
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
      systemIcon: "Settings",
      onClick: () => {
        router.push(link(slugEntity));
      },
    };
  });
};
