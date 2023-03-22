import { IDropDownMenuItem } from "@hadmean/chromista";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import {
  useEntityCrudSettings,
  useEntityDiction,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Plus } from "react-feather";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { usePluginTableMenuItems } from "./portal";

export const useTableMenuItems = (entity: string): IDropDownMenuItem[] => {
  const router = useRouter();
  const entityDiction = useEntityDiction(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const userHasPermission = useUserHasPermission();

  const pluginTableMenuItems = usePluginTableMenuItems();

  const menuItems = pluginTableMenuItems;

  if (
    entityCrudSettings.data?.create &&
    userHasPermission(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity,
        GranularEntityPermissions.Create
      )
    )
  ) {
    menuItems.push({
      order: 1,
      label: `Add New ${entityDiction.singular}`,
      IconComponent: Plus,
      onClick: () => {
        router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity));
      },
    });
  }

  return menuItems;
};
