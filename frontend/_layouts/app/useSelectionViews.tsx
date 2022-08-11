import {
  Settings,
  Home,
  Table,
  BarChart,
  Users,
  User,
  Shield,
} from "react-feather";
import { ISelectionView } from "@gothicgeeks/design-system/dist/Layouts/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "./constants";

export const useSelectionViews = (): ISelectionView[] => {
  const entitiesMenuItems = useEntitiesMenuItems();

  return [
    {
      title: "Home",
      icon: Home,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.HOME,
    },
    {
      title: "Tables",
      description: "Your models",
      icon: Table,
      viewMenuItems: {
        ...entitiesMenuItems,
        data: (entitiesMenuItems.data || []).map(({ label, value }) => ({
          title: label,
          link: NAVIGATION_LINKS.ENTITY.TABLE(value),
        })),
      },
    },
    {
      title: "Dashboards",
      description: "Your models",
      icon: BarChart,
      view: <>Demo View</>,
      // action: () => console.log("Baz"), TODO
    },
    {
      title: "Settings",
      icon: Settings,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.SETTINGS,
    },
    {
      title: "Users",
      icon: Users,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.USERS,
    },
    {
      title: "Roles",
      icon: Shield,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ROLES,
    },
    {
      title: "Account",
      icon: User,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACCOUNT,
    },
  ];
};
