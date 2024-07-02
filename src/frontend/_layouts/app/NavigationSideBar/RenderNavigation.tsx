import Link from "next/link";
import {
  HeaderMenuItemType,
  INavigationMenuItem,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ChevronRight } from "react-feather";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ActionIntegrations } from "shared/types/actions";
import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";
import { useLingui } from "@lingui/react";
import { PORTAL_SYSTEM_LINK_CONFIG_LINKS } from "./portal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SystemIcon } from "@/components/app/system-icons";

const SYSTEM_LINKS_CONFIG_MAP: Record<
  SystemLinks,
  {
    link: string;
    title: MessageDescriptor;
  }
> = {
  [SystemLinks.Settings]: {
    link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
    title: msg`App Settings`,
  },
  [SystemLinks.Home]: {
    link: NAVIGATION_LINKS.DASHBOARD.HOME,
    title: msg`Home`,
  },
  [SystemLinks.Roles]: {
    link: NAVIGATION_LINKS.ROLES.LIST,
    title: msg`Roles`,
  },
  [SystemLinks.Users]: {
    link: NAVIGATION_LINKS.USERS.LIST,
    title: msg`Users`,
  },
  [SystemLinks.Integrations]: {
    link: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(ActionIntegrations.HTTP),
    title: msg`Integrations`,
  },
};

const HEADER_MENU_CONFIG_MAP: Record<
  HeaderMenuItemType,
  {
    title: MessageDescriptor;
  }
> = {
  [HeaderMenuItemType.Accounts]: {
    title: msg`Accounts`,
  },
  [HeaderMenuItemType.AppNavigation]: {
    title: msg`App Navigation`,
  },
  [HeaderMenuItemType.Configurations]: {
    title: msg`Configurations`,
  },
};

interface IProp {
  navigation: INavigationMenuItem[];
  isFullWidth: boolean;
  setIsFullWidth: (value: boolean) => void;
  depth?: number;
  activeItem: Record<string, string>;
  setActiveItem: (depth: number, value: string) => void;
}

const getNavigationDetails = ({
  title,
  type,
  link,
}: {
  type: NavigationMenuItemType;
  title: string;
  link?: string;
}): { link: string; title: MessageDescriptor } => {
  switch (type) {
    case NavigationMenuItemType.Header:
      return {
        link: "#",
        title:
          HEADER_MENU_CONFIG_MAP[link]?.title || fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.ExternalLink:
      return { link, title: fakeMessageDescriptor(title) };
    case NavigationMenuItemType.Dashboard:
      return {
        link: NAVIGATION_LINKS.DASHBOARD.CUSTOM.VIEW(link),
        title: fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.Entities:
      return {
        link: NAVIGATION_LINKS.ENTITY.TABLE(link),
        title: fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.System:
      return (
        { ...SYSTEM_LINKS_CONFIG_MAP, ...PORTAL_SYSTEM_LINK_CONFIG_LINKS }[
          link as SystemLinks
        ] || { link: "/", title: fakeMessageDescriptor(title) }
      );
  }
};

export function RenderNavigation({
  navigation,
  isFullWidth,
  setIsFullWidth,
  depth = 1,
  setActiveItem,
  activeItem,
}: IProp) {
  const { clear: clearBreadCrumbStack } = useNavigationStack();
  const { _ } = useLingui();

  if (!navigation) {
    return null;
  }

  return (
    <ul
      className={cn("mb-0 mt-1", {
        "px-3": isFullWidth,
      })}
    >
      {navigation.map(
        ({ title: title$1, icon, type, link: link$1, id, children }) => {
          const isActive = activeItem[depth] === id;

          const { link, title: title$2 } = getNavigationDetails({
            type,
            link: link$1,
            title: title$1,
          });

          const title = _(title$2);

          const menuIcon = depth === 1 && (
            <SystemIcon
              strokeWidth={isActive ? 2 : 1}
              icon={icon}
              className="w-[20px] h-[20px]"
            />
          );

          return (
            <li className="list-none block transition-all" key={id}>
              {type === NavigationMenuItemType.Header ? (
                <p
                  className={cn(
                    "text-white uppercase text-[11px] font-semibold mt-5 mr-0 mb-2 ml-1",
                    {
                      hidden: !isFullWidth,
                    }
                  )}
                >
                  {title}
                </p>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  style={{
                    marginLeft: (depth - 1) * 8,
                  }}
                  className={cn(
                    "w-full text-white flex mb-1 py-2 items-center justify-start rounded-md hover:bg-primary-shade-thick hover:text-white",
                    {
                      "bg-primary": isActive,
                      "px-3": isFullWidth,
                    }
                  )}
                >
                  {children && children.length > 0 ? (
                    <Button
                      onClick={() => {
                        clearBreadCrumbStack();
                        setIsFullWidth(true);
                        setActiveItem(depth, isActive ? "" : id);
                      }}
                    >
                      {menuIcon}
                      {isFullWidth && (
                        <div className="flex justify-between items-center w-full">
                          <p
                            className={cn(
                              "text-sm text-white ml-2 transition-all"
                            )}
                          >
                            {title}
                          </p>
                          <ChevronRight
                            className={cn(
                              "fill-white cursor-pointer ml-0 transition-all",
                              {
                                "rotate-90": isActive,
                              }
                            )}
                            size={16}
                          />
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Link
                      href={link}
                      onClick={() => {
                        clearBreadCrumbStack();
                        setActiveItem(depth, id);
                      }}
                      target={
                        type === NavigationMenuItemType.ExternalLink
                          ? "_blank"
                          : undefined
                      }
                    >
                      {icon && menuIcon}
                      {isFullWidth && (
                        <p
                          className={cn(
                            "text-sm text-white ml-2 transition-all"
                          )}
                        >
                          {title}
                        </p>
                      )}
                    </Link>
                  )}
                </Button>
              )}
              {isActive && isFullWidth && (
                <RenderNavigation
                  setIsFullWidth={setIsFullWidth}
                  navigation={children}
                  isFullWidth={isFullWidth}
                  depth={depth + 1}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                />
              )}
            </li>
          );
        }
      )}
    </ul>
  );
}
