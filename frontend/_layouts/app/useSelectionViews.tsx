import { Settings, Home, Table, BarChart, Users, User } from "react-feather";
import { ISelectionView } from "@gothicgeeks/design-system/dist/Layouts/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";

export const useSelectionViews = (): ISelectionView[] => {
  const entitiesMenuItems = useEntitiesMenuItems();

  return [
    {
      title: "Home",
      icon: Home,
      link: NAVIGATION_LINKS.DASHBOARD,
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
          // link: () => {
          //   goTo(NAVIGATION_LINKS.ENTITY.TABLE(value));
          // },
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
      link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
    },
    {
      title: "Users",
      icon: Users,
      link: NAVIGATION_LINKS.USERS,
    },
    {
      title: "Account",
      icon: User,
      link: NAVIGATION_LINKS.ACCOUNT.PROFILE,
    },
  ];
};
