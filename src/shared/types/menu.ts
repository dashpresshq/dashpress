import type { SystemIconsKeys } from "@/shared/constants/Icons";

export enum NavigationMenuItemType {
  ExternalLink = "external-link",
  Header = "header",
  Dashboard = "dashboard",
  Entities = "entities",
  System = "system",
}

export enum HeaderMenuItemType {
  Accounts = "accounts",
  AppNavigation = "app-navigation",
  Configurations = "configurations",
}

export enum SystemLinks {
  Settings = "settings",
  Home = "home",
  Roles = "roles",
  Users = "users",
  Integrations = "integrations",
}

export interface INavigationMenuItem {
  id: string;
  title: string;
  type: NavigationMenuItemType;
  icon?: SystemIconsKeys;
  link?: string;
  children?: INavigationMenuItem[];
}
