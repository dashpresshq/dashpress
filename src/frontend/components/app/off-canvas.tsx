import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import type { ReactNode } from "react";

import { cn } from "@/components/utils";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { AppBlur } from "./app-blur";

export interface IProps {
  show: boolean;
  title: MessageDescriptor;
  children: ReactNode;
  onClose: () => void;
  size: "sm" | "md" | "lg";
}

export function OffCanvas({ show, onClose, title, children, size }: IProps) {
  const { _ } = useLingui();

  return (
    <AppBlur isOn={show}>
      <Sheet open={show} onOpenChange={onClose}>
        <SheetContent
          className={cn("flex w-full flex-col", {
            "md:w-[400px]": size === "sm",
            "md:w-[500px]": size === "md",
            "md:w-[600px]": size === "lg",
          })}
        >
          <SheetHeader>
            <SheetTitle>{_(title)}</SheetTitle>
          </SheetHeader>
          <Separator className="mt-2" />
          <ScrollArea className="grow">
            <div className="my-2 px-4">{children}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </AppBlur>
  );
}
