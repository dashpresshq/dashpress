import {
  useEntityCrudSettings,
  useEntityDiction,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import noop from "lodash/noop";
import { useRouter } from "next/router";
import { Download, Plus } from "react-feather";

export const useTableMenuItems = (entity: string) => {
  const router = useRouter();
  const entityDiction = useEntityDiction(entity);
  const entityCrudSettings = useEntityCrudSettings(entity);

  let menuItems = [
    {
      label: "Download as CSV",
      IconComponent: Download,
      onClick: () => noop("TODO"),
    },
    {
      label: "Multi Select Mode",
      IconComponent: Download,
      onClick: () => noop("TODO"),
    },
  ];

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
