import { ReactNode } from "react";
import { TooltipContent } from "@radix-ui/react-tooltip";
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface IProps {
  children: ReactNode;
  text: string;
}

export function Tooltip({ children, text }: IProps) {
  if (!text) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <div
            className="rounded-md bg-base px-3 py-1.5 text-sm text-main shadow-md"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
