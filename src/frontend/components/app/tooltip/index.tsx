import { TooltipContent } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface IProps {
  children: ReactNode;
  text: string;
  isOverAButton: boolean;
}

export function Tooltip({ children, text, isOverAButton }: IProps) {
  if (!text) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild={isOverAButton}>{children}</TooltipTrigger>
        <TooltipContent>
          <div
            className="max-w-sm rounded-md bg-base px-3 py-1.5 text-sm text-main shadow-md"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
