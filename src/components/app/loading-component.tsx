import * as React from "react";
import { Loader } from "react-feather";
import { cn } from "@/lib/utils";

export function ComponentIsLoading({ fullPage }: { fullPage: boolean }) {
  return (
    <div
      className={cn("flex size-full items-center justify-center", {
        "w-lvw h-lvh": fullPage,
      })}
    >
      <Loader className="size-8 animate-spin text-primary" />
    </div>
  );
}
