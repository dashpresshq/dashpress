import { useState, useEffect, useMemo } from "react";
import { ChevronDown, MoreVertical } from "react-feather";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggle } from "@/frontend/hooks/state/useToggleState";
import { MenuSection } from "@/components/app/menu-section";
import { IMenuActionItem } from "../button/types";
import { SoftButton } from "../button/soft";
import { cn } from "@/lib/utils";

export interface IProps {
  menuItems: IMenuActionItem[];
  ariaLabel: string;
  disabled?: boolean;
  ellipsis?: true;
  contentClassName?: string;
  className?: string;
}

export function DropDownMenu({
  menuItems: menuItems$1,
  ellipsis,
  ariaLabel,
  contentClassName,
  className,
}: IProps) {
  const [currentMenuItem, setCurrentMenuItem] = useState<IMenuActionItem>(
    menuItems$1[0]
  );

  const menuItems: IMenuActionItem[] = useMemo(() => {
    return [...menuItems$1]
      .sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
      })
      .map((menuItem) => {
        return {
          ...menuItem,
          secondaryAction: () => {
            setCurrentMenuItem(menuItem);
          },
        };
      });
  }, [menuItems$1]);

  useEffect(() => {
    setCurrentMenuItem(menuItems[0]);
  }, [JSON.stringify(menuItems)]);

  if (menuItems.length === 0) {
    return null;
  }

  if (menuItems.length === 1 && !ellipsis) {
    return <SoftButton {...currentMenuItem} />;
  }

  const { isOn: isOpen, toggle } = useToggle(false);

  return (
    <div className="relative flex">
      {!ellipsis && (
        <SoftButton {...currentMenuItem} className="rounded-r-none" />
      )}
      <DropdownMenu open={isOpen} onOpenChange={toggle}>
        <DropdownMenuTrigger className={className}>
          {ellipsis ? (
            <Button className="p-0.5 px-1" variant="soft">
              <MoreVertical
                size={16}
                className="cursor-pointer"
                aria-label={ariaLabel}
              />
            </Button>
          ) : (
            <Button
              variant="soft"
              className="rounded-l-none px-1"
              aria-label="Toggle Dropdown"
            >
              <ChevronDown size={16} />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn("p-0 border-0", contentClassName)}
          onClick={toggle}
        >
          <MenuSection menuItems={menuItems} size="sm" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
