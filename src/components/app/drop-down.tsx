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
      <DropdownMenuTrigger>{target}</DropdownMenuTrigger>
      <DropdownMenuContent className={className}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
