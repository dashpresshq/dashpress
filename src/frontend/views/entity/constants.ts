import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { UserPermissions } from "shared/constants/user";
import { CrudViewsKeys } from "shared/configurations";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { msg } from "@lingui/macro";
import { MessageDescriptor } from "@lingui/core";
import { IMenuActionItem } from "@/components/app/button/types";

export const ENTITY_CONFIGURATION_VIEW = "ENTITY_CONFIGURATION_VIEW";

export const ENTITY_FIELD_SETTINGS_TAB_LABELS = {
  LABELS: msg`Labels`,
  FORM: msg`Form`,
  ORDER: msg`Order`,
};

export const ENTITY_CRUD_LABELS: Record<CrudViewsKeys, MessageDescriptor> = {
  create: msg`Create`,
  update: msg`Update`,
  details: msg`Details`,
  table: msg`Table`,
  delete: msg`Delete`,
};

export const useEntityActionMenuItems = (
  slugEntity: string
): IMenuActionItem[] => {
  const router = useRouter();

  const entityCrudConfig = useEntityCrudConfig(slugEntity);

  const userHasPermission = useUserHasPermission();

  if (!userHasPermission(UserPermissions.CAN_CONFIGURE_APP)) {
    return [];
  }

  if (!router.isReady) {
    return [];
  }

  return [
    {
      id: `${slugEntity} Settings`,
      systemIcon: "Settings",
      label: entityCrudConfig.TEXT_LANG.SETTINGS,
      action: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(slugEntity),
    },
  ];
};
