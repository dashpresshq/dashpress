import * as React from "react";
import { Loader } from "react-feather";
import { cn } from "@/lib/utils";

export function ComponentIsLoading({ fullPage }: { fullPage: boolean }) {
  return (
    <div
      className={cn("flex justify-center items-center w-full h-full", {
        "w-lvw h-lvh": fullPage,
      })}
    >
      <Loader className="animate-spin w-8 h-8 text-primary" />
    </div>
  );
}
