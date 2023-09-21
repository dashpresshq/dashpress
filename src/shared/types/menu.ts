import { SystemIconsKeys } from "shared/constants/Icons";

export enum NavigationMenuItemType {
  ExternalLink = "external-link",
  Header = "header",
  Dashboard = "dashboard",
  Entities = "entities",
  System = "system",
}

export enum SystemLinks {
  Settings = "settings",
  Home = "home",
  Roles = "roles",
  Users = "users",
  Actions = "actions",
  AllDashboards = "all-dashboard",
}

export interface INavigationMenuItem {
  id: string;
  title: string;
  type: NavigationMenuItemType;
  icon?: SystemIconsKeys;
  link?: string;
  children?: INavigationMenuItem[];
}
