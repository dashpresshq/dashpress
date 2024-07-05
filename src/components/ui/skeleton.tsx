import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full animate-pulse rounded-md bg-soft", className)}
      {...props}
    />
  );
}

export { Skeleton };
