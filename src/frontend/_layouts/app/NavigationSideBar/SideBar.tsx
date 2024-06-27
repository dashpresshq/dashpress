import Link from "next/link";
import { ChevronRight } from "react-feather";
import { useApi } from "frontend/lib/data/useApi";
import { INavigationMenuItem } from "shared/types/menu";
import { useSessionStorage } from "react-use";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { useEffect } from "react";
import {
  NAVIGATION_MENU_ENDPOINT,
  SIDE_BAR_WIDTH_VARIATIONS,
} from "./constants";
import { NavigationSkeleton } from "./NavigationSkeleton";
import { ProfileOnNavigation } from "./Profile";
import { RenderNavigation } from "./RenderNavigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ViewStateMachine } from "@/components/app/view-state-machine";

interface IProps {
  isFullWidth: boolean;
  setIsFullWidth: (value: boolean) => void;
}

export const useNavigationMenuItems = () => {
  return useApi<INavigationMenuItem[]>(NAVIGATION_MENU_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Navigation Menu`),
    defaultData: [],
    persist: true,
  });
};

export function SideBar({ isFullWidth, setIsFullWidth }: IProps) {
  const siteConfig = useAppConfiguration("site_settings");
  const navigationMenuItems = useNavigationMenuItems();

  const [activeItem, setActiveItem$1] = useSessionStorage<
    Record<string, string>
  >(`navigation-current-item`, {});

  const setActiveItem = (depth: number, value: string) => {
    const newValue: Record<string, string> = { ...activeItem, [depth]: value };

    const newValueFiltered = Object.fromEntries(
      typescriptSafeObjectDotEntries(newValue).filter(([key]) => +key <= depth)
    ) as Record<string, string>;

    setActiveItem$1(newValueFiltered);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!event.ctrlKey) return;
    if (event.key !== "B") return;
    console.log(event.key);
    setIsFullWidth(!isFullWidth);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <div
      className="fixed transition-all min-h-dvh"
      style={{
        maxWidth: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        minWidth: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        width: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        flexBasis: isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
      }}
    >
      <div className="flex items-center justify-center h-[50px] bg-primary-shade-thick-xxl">
        <Link href="/">
          {isFullWidth ? (
            <img
              className="w-28 mt-3"
              src={siteConfig.data.fullLogo}
              alt="full logo"
            />
          ) : (
            <img className="w-7" src={siteConfig.data.logo} alt="small logo" />
          )}
        </Link>
      </div>
      <div className="flex justify-between flex-col h-[calc(100dvh-50px)]">
        <ScrollArea className="h-[calc(100%-1px)] bg-primary-shade-thick-xxl">
          <ProfileOnNavigation isFullWidth={isFullWidth} />
          <ViewStateMachine
            loading={navigationMenuItems.isLoading}
            error={navigationMenuItems.error}
            loader={<NavigationSkeleton />}
          >
            <RenderNavigation
              navigation={navigationMenuItems.data}
              isFullWidth={isFullWidth}
              setIsFullWidth={setIsFullWidth}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </ViewStateMachine>
        </ScrollArea>

        <Button
          variant="ghost"
          className="h-9 bg-primary-shade-thick-xl shadow-sm rounded-none"
          onClick={() => setIsFullWidth(!isFullWidth)}
        >
          <ChevronRight
            className={cn(
              "w-8 h-8 text-white inline-block transition-transform",
              {
                "rotate-180": isFullWidth,
              }
            )}
            aria-label="Toggle Side Bar"
          />
        </Button>
      </div>
    </div>
  );
}
