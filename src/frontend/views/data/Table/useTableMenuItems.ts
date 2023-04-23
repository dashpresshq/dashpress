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
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { usePluginTableMenuItems } from "./portal";

export const useTableMenuItems = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
): IDropDownMenuItem[] => {
  const router = useRouter();
  const entityDiction = useEntityDiction(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);
  const userHasPermission = useUserHasPermission();

  const pluginTableMenuItems = usePluginTableMenuItems(entity, reference);

  if (entity === SLUG_LOADING_VALUE) {
    return [];
  }

  if (reference && !reference.referenceField) {
    return [];
  }

  if (
    entityCrudSettings.data?.create &&
    userHasPermission(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity,
        GranularEntityPermissions.Create
      )
    )
  ) {
    pluginTableMenuItems.push({
      id: "add",
      order: 1,
      label: `Add New ${entityDiction.singular}`,
      IconComponent: Plus,
      onClick: () => {
        if (reference) {
          router.push(
            `${NAVIGATION_LINKS.ENTITY.CREATE(entity)}?${
              reference.referenceField
            }=${reference.entityId}`
          );
          return;
        }
        router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity));
      },
    });
  }

  return pluginTableMenuItems;
};
