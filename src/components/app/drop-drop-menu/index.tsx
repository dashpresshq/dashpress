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

export interface IProps {
  menuItems: IMenuActionItem[];
  ariaLabel: string;
  disabled?: boolean;
  ellipsis?: true;
  className?: string;
}

export function DropDownMenu({
  menuItems: menuItems$1,
  ellipsis,
  ariaLabel,
  className,
}: IProps) {
  const menuItems = useMemo(() => {
    return [...menuItems$1].sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    });
  }, [menuItems$1]);

  const [currentMenuItem, setCurrentMenuItem] = useState<IMenuActionItem>(
    menuItems?.[0]
  );

  useEffect(() => {
    setCurrentMenuItem(menuItems[0]);
  }, [JSON.stringify(menuItems)]);

  if (menuItems.length === 0) {
    return null;
  }

  if (menuItems.length === 1 && !ellipsis) {
    return <SoftButton {...currentMenuItem} />;
  }

  // TODO
  // const onMenuItemClick = (menuIndex: number) => {
  //   const menuItem = menuItems[menuIndex];
  //   setCurrentMenuItem(menuItem);
  // };

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
        <DropdownMenuContent className="p-0 border-0" onClick={toggle}>
          <MenuSection menuItems={menuItems$1} size="sm" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
