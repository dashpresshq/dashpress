import type { ConfigurationApiService } from "backend/configuration/configuration.service";
import { configurationApiService } from "backend/configuration/configuration.service";
import type { EntitiesApiService } from "backend/entities/entities.service";
import { entitiesApiService } from "backend/entities/entities.service";
import type { RolesApiService } from "backend/roles/roles.service";
import { rolesApiService } from "backend/roles/roles.service";
import { nanoid } from "nanoid";
import { META_USER_PERMISSIONS, UserPermissions } from "shared/constants/user";
import { sortListByOrder } from "shared/lib/array/sort";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import type { INavigationMenuItem } from "shared/types/menu";
import {
  HeaderMenuItemType,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import type { ILabelValue } from "shared/types/options";
import { GranularEntityPermissions } from "shared/types/user";

import { getPortalMenuItems, portalCheckIfIsMenuAllowed } from "./portal";
import type { IBaseNavigationMenuApiService } from "./types";

const SYSTEM_LINKS_CONFIG_MAP: Record<
  SystemLinks,
  {
    permission: string;
  }
> = {
  [SystemLinks.Settings]: {
    permission: UserPermissions.CAN_CONFIGURE_APP,
  },
  [SystemLinks.Home]: {
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  },
  [SystemLinks.Roles]: {
    permission: UserPermissions.CAN_MANAGE_PERMISSIONS,
  },
  [SystemLinks.Users]: {
    permission: UserPermissions.CAN_MANAGE_USERS,
  },
  [SystemLinks.Integrations]: {
    permission: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
  },
};

export class NavigationMenuApiService implements IBaseNavigationMenuApiService {
  constructor(
    private readonly _entitiesApiService: EntitiesApiService,
    private readonly _configurationApiService: ConfigurationApiService,
    private readonly _rolesApiService: RolesApiService
  ) {}

  async getMenuItems(userRole: string) {
    const portalMenuItems = await getPortalMenuItems(userRole, this);

    if (portalMenuItems !== null) {
      return portalMenuItems;
    }

    const navItems = await this.generateMenuItems();

    return await this.filterOutUserMenuItems(userRole, navItems);
  }

  async generateMenuItems(): Promise<INavigationMenuItem[]> {
    let navItems: INavigationMenuItem[] = [];

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Home",
        icon: "Home",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Home,
      },
    ]);

    const entitiesToShow = await this.getUserEntities();

    const dictionMap = Object.fromEntries(
      await Promise.all(
        entitiesToShow.map(async (value) => [
          value.value,
          await this._configurationApiService.show(
            "entity_diction",
            value.value
          ),
        ])
      )
    );

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "App Navigation",
        icon: "File",
        type: NavigationMenuItemType.Header,
        link: HeaderMenuItemType.AppNavigation,
      },
    ]);

    navItems = navItems.concat(
      entitiesToShow.map((entity) => ({
        id: nanoid(),
        title:
          dictionMap[entity.value].plural || userFriendlyCase(entity.label),
        icon: "File",
        type: NavigationMenuItemType.Entities,
        link: entity.value,
      }))
    );

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Accounts",
        icon: "Users",
        type: NavigationMenuItemType.Header,
        link: HeaderMenuItemType.Accounts,
      },
      {
        id: nanoid(),
        title: "Users",
        icon: "Users",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Users,
      },
      {
        id: nanoid(),
        title: "Roles",
        icon: "Shield",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Roles,
      },
      {
        id: nanoid(),
        title: "Configurations",
        icon: "Users",
        type: NavigationMenuItemType.Header,
        link: HeaderMenuItemType.Configurations,
      },
      {
        id: nanoid(),
        title: "App Settings",
        icon: "Settings",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Settings,
      },
      {
        id: nanoid(),
        title: "Integrations",
        icon: "Zap",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Integrations,
      },
    ]);

    return navItems;
  }

  private async getUserEntities(): Promise<ILabelValue[]> {
    const [hiddenMenuEntities, entitiesOrder, activeEntities] =
      await Promise.all([
        this._configurationApiService.show("disabled_menu_entities"),
        this._configurationApiService.show("menu_entities_order"),
        this._entitiesApiService.getActiveEntities(),
      ]);

    const menuEntities: { label: string; value: string }[] = activeEntities
      .filter(({ value }) => !hiddenMenuEntities.includes(value))
      .sort((a, b) => a.value.localeCompare(b.value));

    return sortListByOrder(entitiesOrder, menuEntities, "value");
  }

  async filterOutUserMenuItems(
    userRole: string,
    menuItems: INavigationMenuItem[]
  ): Promise<INavigationMenuItem[]> {
    const allowedMenuItems: INavigationMenuItem[] = [];
    for (const menuItem of menuItems) {
      if (menuItem.children) {
        // eslint-disable-next-line no-param-reassign
        menuItem.children = await this.filterOutUserMenuItems(
          userRole,
          menuItem.children
        );
      }

      if (await this.isMenuItemAllowed(menuItem, userRole)) {
        allowedMenuItems.push(menuItem);
      }
    }
    return allowedMenuItems;
  }

  private async isMenuItemAllowed(
    menuItem: INavigationMenuItem,
    userRole: string
  ): Promise<boolean> {
    const isMenuAllowed = await portalCheckIfIsMenuAllowed(menuItem, userRole);

    if (typeof isMenuAllowed === "boolean") {
      return isMenuAllowed;
    }

    switch (menuItem.type) {
      case NavigationMenuItemType.Header:
        return true;
      case NavigationMenuItemType.System:
        return await this._rolesApiService.canRoleDoThis(
          userRole,
          SYSTEM_LINKS_CONFIG_MAP[menuItem.link as SystemLinks].permission
        );

      case NavigationMenuItemType.Entities:
        return await this._rolesApiService.canRoleDoThis(
          userRole,
          META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
            menuItem.link,
            GranularEntityPermissions.Show
          )
        );
      default:
        return false;
    }
  }
}

export const navigationMenuApiService = new NavigationMenuApiService(
  entitiesApiService,
  configurationApiService,
  rolesApiService
);
