import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useNavigationStack } from "frontend/lib/routing/useGoBackContext";
import noop from "lodash/noop";
import { useRouter } from "next/router";
import { Download, Plus } from "react-feather";

export const useTableMenuItems = () => {
  const router = useRouter();
  const entityDiction = useEntityDiction();
  const entityCrudSettings = useEntityCrudSettings();
  const entity = useEntitySlug();
  const { pushToStack } = useNavigationStack(entityDiction.plural);

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
          pushToStack();
          router.push(NAVIGATION_LINKS.ENTITY.CREATE(entity));
        },
      },
      ...menuItems,
    ];
  }

  return menuItems;
};
