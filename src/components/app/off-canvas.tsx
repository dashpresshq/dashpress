import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { NextPortal } from "./next-portal";
import { ScrollArea } from "../ui/scroll-area";

export interface IProps {
  show: boolean;
  title: MessageDescriptor;
  children: ReactNode;
  onClose: () => void;
  size: "sm" | "md" | "lg";
}

export function OffCanvas({ show, onClose, title, children, size }: IProps) {
  const { _ } = useLingui();

  if (!show) {
    return null;
  }

  return (
    <NextPortal>
      <Sheet open={show} onOpenChange={onClose}>
        <SheetContent
          className={cn("w-full flex flex-col", {
            "md:w-[400px]": size === "sm",
            "md:w-[500px]": size === "md",
            "md:w-[600px]": size === "lg",
          })}
        >
          <SheetHeader>
            <SheetTitle>{_(title)}</SheetTitle>
          </SheetHeader>
          <Separator className="mt-2" />
          <ScrollArea className="flex-grow px-4 my-2">{children}</ScrollArea>
        </SheetContent>
      </Sheet>
    </NextPortal>
  );
}
