import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { CrudViewsKeys } from "shared/configurations";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";

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

export const useEntityActionMenuItems = (
  slugEntity: string
): IDropDownMenuItem[] => {
  const router = useRouter();

  const entityCrudConfig = useEntityCrudConfig(slugEntity);

  const userHasPermission = useUserHasPermission();

  if (!userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)) {
    return [];
  }

  if (!router.isReady) {
    return [];
  }

  return [
    {
      id: `${slugEntity} Settings`,
      systemIcon: "Settings",
      label: `${entityCrudConfig.TEXT_LANG.TITLE} Settings`,
      action: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(slugEntity),
    },
  ];
};
