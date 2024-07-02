import { ReactNode } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export interface IProps {
  target: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Dropdown({ target, children, className }: IProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        {target}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={className} align="end">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
