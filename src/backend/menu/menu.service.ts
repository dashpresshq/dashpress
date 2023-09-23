import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { canRoleDoThisSync } from "shared/logic/permissions";
import {
  INavigationMenuItem,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import {
  EntitiesApiService,
  entitiesApiService,
} from "backend/entities/entities.service";
import { noop } from "shared/lib/noop";
import {
  ConfigurationApiService,
  configurationApiService,
} from "backend/configuration/configuration.service";
import { sortByList } from "shared/logic/entities/sort.utils";
import { RolesApiService, rolesApiService } from "backend/roles/roles.service";
import { ILabelValue } from "shared/types/options";
import { portalCheckIfIsMenuAllowed, getPortalMenuItems } from "./portal";
import { IBaseNavigationMenuApiService } from "./types";

const SYSTEM_LINKS_PERMISSION_MAP: Record<SystemLinks, string> = {
  [SystemLinks.Settings]: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  [SystemLinks.Home]: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  [SystemLinks.Roles]: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  [SystemLinks.Users]: USER_PERMISSIONS.CAN_MANAGE_USERS,
  [SystemLinks.Actions]: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  [SystemLinks.AllDashboards]: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
};

export class NavigationMenuApiService
  implements IApplicationService, IBaseNavigationMenuApiService
{
  constructor(
    private readonly _entitiesApiService: EntitiesApiService,
    private readonly _configurationApiService: ConfigurationApiService,
    private readonly _rolesApiService: RolesApiService
  ) {}

  async bootstrap() {
    noop();
  }

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

    const entitiesToShow = await this.getUserMenuEntities();

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Entities",
        type: NavigationMenuItemType.Header,
        children: [],
      },
    ]);

    entitiesToShow.forEach((entity) => {
      navItems.push({
        id: nanoid(),
        title: userFriendlyCase(entity.label), // TODO get the current label
        icon: "File",
        type: NavigationMenuItemType.Entities,
        link: entity.value,
      });
    });

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Application Menu",
        type: NavigationMenuItemType.Header,
      },
      {
        id: nanoid(),
        title: "Actions",
        icon: "Zap",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Actions,
      },
      {
        id: nanoid(),
        title: "Settings",
        icon: "Settings",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Settings,
        children: [],
      },
      {
        id: nanoid(),
        title: "Accounts",
        icon: "Users",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Users,
        children: [
          {
            id: nanoid(),
            title: "Users",
            icon: "Users",
            type: NavigationMenuItemType.System,
            link: SystemLinks.Users,
            children: [],
          },
          {
            id: nanoid(),
            title: "Roles",
            icon: "Shield",
            type: NavigationMenuItemType.System,
            link: SystemLinks.Roles,
            children: [],
          },
        ],
      },
    ]);

    return navItems;
  }

  private async getUserMenuEntities(): Promise<ILabelValue[]> {
    const [hiddenMenuEntities, entitiesOrder, activeEntities] =
      await Promise.all([
        this._configurationApiService.show<string[]>("disabled_menu_entities"),
        this._configurationApiService.show<string[]>("menu_entities_order"),
        this._entitiesApiService.getActiveEntities(),
      ]);

    const menuEntities: { label: string; value: string }[] = activeEntities
      .filter(({ value }) => !hiddenMenuEntities.includes(value))
      .sort((a, b) => a.value.localeCompare(b.value));

    sortByList(menuEntities, entitiesOrder, "value");

    return menuEntities;
  }

  async filterOutUserMenuItems(
    userRole: string,
    navItems: INavigationMenuItem[]
  ) {
    return this.filterMenuItemsBasedOnPermissions(
      userRole,
      navItems,
      await this._rolesApiService.getRolePermissions(userRole)
    );
  }

  private filterMenuItemsBasedOnPermissions(
    userRole: string,
    menuItems: INavigationMenuItem[],
    userPermissions: string[]
  ): INavigationMenuItem[] {
    return menuItems.reduce((allowedMenuItems, menuItem) => {
      if (menuItem.children) {
        // eslint-disable-next-line no-param-reassign
        menuItem.children = this.filterMenuItemsBasedOnPermissions(
          userRole,
          menuItem.children,
          userPermissions
        );
      }
      if (this.isMenuItemAllowed(menuItem, userRole, userPermissions)) {
        return [...allowedMenuItems, menuItem];
      }
      return allowedMenuItems;
    }, []);
  }

  private async isMenuItemAllowed(
    menuItem: INavigationMenuItem,
    userRole: string,
    userPermissions: string[]
  ): Promise<boolean> {
    const isMenuAllowed = await portalCheckIfIsMenuAllowed(
      menuItem,
      userRole,
      userPermissions
    );

    if (typeof isMenuAllowed === "boolean") {
      return isMenuAllowed;
    }

    switch (menuItem.type) {
      case NavigationMenuItemType.Header:
        return true;
      case NavigationMenuItemType.System:
        return canRoleDoThisSync(
          userRole,
          SYSTEM_LINKS_PERMISSION_MAP[menuItem.link],
          false,
          userPermissions
        );

      case NavigationMenuItemType.Entities:
        return canRoleDoThisSync(
          userRole,
          META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
            menuItem.link,
            GranularEntityPermissions.Show
          ),
          false,
          userPermissions
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
