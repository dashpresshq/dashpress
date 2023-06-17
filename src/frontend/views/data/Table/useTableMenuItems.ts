import { IDropDownMenuItem } from "@hadmean/chromista";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Plus } from "react-feather";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { usePluginTableMenuItems } from "./portal";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";

export const useTableMenuItems = (
  entity: string,
  reference?: {
    referenceField: string;
    entityId: string;
  }
): IDropDownMenuItem[] => {
  const router = useRouter();
  const entityCrudConfig = useEntityCrudConfig(entity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  const pluginTableMenuItems = usePluginTableMenuItems(entity, reference);

  if (entity === SLUG_LOADING_VALUE) {
    return [];
  }

  if (reference && !reference.referenceField) {
    return [];
  }

  if (canUserPerformCrudAction("create")) {
    pluginTableMenuItems.push({
      id: "add",
      order: 1,
      label: entityCrudConfig.TEXT_LANG.CREATE,
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
