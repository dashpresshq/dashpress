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

const GROUP_SPLIT = 10;

export const splitTextInGroups = (text: string) =>
  text
    .split(" ")
    .reduce((acc, curr, index) => {
      const i = Math.floor(index / GROUP_SPLIT);

      if (!acc[i]) {
        acc[i] = "";
      }

      acc[i] += `${curr} `;

      return acc;
    }, [])
    .join("<br />")
    .trim();

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
            className="rounded-md bg-base px-3 py-1.5 text-sm text-main shadow-md"
            dangerouslySetInnerHTML={{ __html: splitTextInGroups(text) }}
          />
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
