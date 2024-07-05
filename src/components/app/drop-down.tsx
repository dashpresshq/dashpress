import type { ReactNode } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export interface IProps {
  target: ReactNode;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Dropdown({ target, children, className, ariaLabel }: IProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" aria-label={ariaLabel}>
        {target}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={className} align="end">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
