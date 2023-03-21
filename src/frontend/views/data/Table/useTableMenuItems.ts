import { IDropDownMenuItem } from "@hadmean/chromista";
import {
  useEntityCrudSettings,
  useEntityDiction,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Plus } from "react-feather";
import { usePluginTableMenuItems } from "./portal";

export const useTableMenuItems = (entity: string): IDropDownMenuItem[] => {
  const router = useRouter();
  const entityDiction = useEntityDiction(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);

  const pluginTableMenuItems = usePluginTableMenuItems();

  let menuItems: IDropDownMenuItem[] = [];

  if (entityCrudSettings.data?.create) {
    menuItems.push({
      label: `Add New ${entityDiction.singular}`,
      IconComponent: Plus,
      onClick: () => {
        router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity));
      },
    });
  }

  menuItems = menuItems.concat(pluginTableMenuItems);

  return menuItems;
};
