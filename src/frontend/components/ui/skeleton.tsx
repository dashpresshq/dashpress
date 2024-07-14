import type { HTMLAttributes } from "react";

import { cn } from "@/components/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full animate-pulse rounded-md bg-soft", className)}
      tabIndex={0}
      role="progressbar"
      aria-valuetext="Loading..."
      {...props}
    />
  );
}

export { Skeleton };
