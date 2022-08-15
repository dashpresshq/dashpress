import { IDropDownMenuItem } from "@adminator/chromista";
import {
  useEntityCrudSettings,
  useEntityDiction,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Plus } from "react-feather";

export const useTableMenuItems = (entity: string): IDropDownMenuItem[] => {
  const router = useRouter();
  const entityDiction = useEntityDiction(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);

  let menuItems: IDropDownMenuItem[] = [];

  if (entityCrudSettings.data?.create) {
    menuItems = [
      {
        label: `Add New ${entityDiction.singular}`,
        IconComponent: Plus,
        onClick: () => {
          router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity));
        },
      },
      ...menuItems,
    ];
  }

  return menuItems;
};
